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
}
