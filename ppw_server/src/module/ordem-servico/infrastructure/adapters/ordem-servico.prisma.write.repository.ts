import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { OrdemServicoEntity } from '../../domain/entity/ordem-servico.entity';
import { OrdemServicoWriteRepository } from '../../domain/ports/ordem-servico.write.repository';
import { Status } from '../../domain/value-objects/status.value.object';
import { OrdemServicoMapper } from '../mappers/ordem-servico.mappers';

@Injectable()
export class OrdemServicoPrismaWriteRepository implements OrdemServicoWriteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async criarOrdemServico(entity: OrdemServicoEntity): Promise<OrdemServicoEntity | null> {
    const data = OrdemServicoMapper.toPrismaFromEntity(entity);

    // Aponta para a nova tabela de Ordens de Serviço
    const osCriada = await this.prisma.ordemServico.create({ data: data as any });

    return OrdemServicoMapper.toEntityFromPrisma(osCriada as any);
  }

  async updateOrdemServico(entity: OrdemServicoEntity): Promise<OrdemServicoEntity> {
    const data = OrdemServicoMapper.toPrismaFromEntity(entity);

    const osUpdated = await this.prisma.ordemServico.update({
      where: { id: entity.props.id },
      data: {
        status: data.status as any,
        diagnosticoMecanico: data.diagnosticoMecanico,
        itensOrcamento: data.itensOrcamento as any,
      },
    });

    return OrdemServicoMapper.toEntityFromPrisma(osUpdated as any);
  }

  async updateOrdemServicoStatus(id: string, status: Status): Promise<void> {
    // Implementação real para atualizar apenas o status (útil para a Máquina de Estados)
    await this.prisma.ordemServico.update({
      where: { id },
      data: { status: status.value as any },
    });
  }

  async deleteOrdemServico(id: string): Promise<void> {
    await this.prisma.ordemServico.delete({
      where: { id },
    });
  }
  async alocarPecaEFaturar(osId: string, pecaId: string, quantidadeUsada: number, autorId: string): Promise<void> {
    try {
      // O $transaction garante que ou TUDO funciona, ou NADA é salvo (ACID)
      await this.prisma.$transaction(async (tx) => {
        // 1. Baixa Atômica no Estoque (Evita Race Condition)
        const pecaAtualizada = await tx.pecaEstoque.update({
          where: { id: pecaId },
          data: {
            quantidade: {
              decrement: quantidadeUsada,
            },
          },
        });

        // 2. Validação Restrita pós-baixa (Rollback se furar estoque)
        if (pecaAtualizada.quantidade < 0) {
          throw new Error('Estoque insuficiente para alocar esta peça.');
        }

        // 3. Atualiza o Status da OS para CONCLUIDO
        await tx.ordemServico.update({
          where: { id: osId },
          data: { status: 'CONCLUIDO' as any }, // O 'as any' resolve o conflito de tipagem
        });

        // 4. Trilha de Auditoria Obrigatória (Audit Log)
        await tx.historicoOS.create({
          data: {
            id_registro: osId,
            estado_anterior: 'EXECUCAO_TRABALHO',
            novo_estado: 'CONCLUIDO' as any,
            autor_id: autorId,
            justificativa: `Baixa atômica de ${quantidadeUsada}x ${pecaAtualizada.nome} aplicada ao estoque.`,
          },
        });
      });
    } catch (error) {
      // 'error as Error' avisa o TypeScript que é seguro ler o .message
      throw new Error(`Falha na transação atômica: ${(error as Error).message}`);
    }
  }
}
