import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { OrdemServicoEntity } from '../../domain/entity/ordem-servico.entity';
import { OrdemServicoReadRepository } from '../../domain/ports/ordem-servico.read.repository';
import { OrdemServicoMapper } from '../mappers/ordem-servico.mappers';

@Injectable()
export class OrdemServicoPrismaReadRepository implements OrdemServicoReadRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOrdemServicoAll(): Promise<OrdemServicoEntity[]> {
    // Altera de this.prisma.ticket para a nova tabela this.prisma.ordemServico
    const ordensServico = await this.prisma.ordemServico.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Utiliza o método atualizado do nosso OrdemServicoMapper
    return OrdemServicoMapper.toListEntityFromListPrisma(ordensServico);
  }

  async findOrdemServicoById(id: string): Promise<OrdemServicoEntity | null> {
    // Implementação real da query no banco de dados para o Update funcionar
    const ordemServico = await this.prisma.ordemServico.findUnique({
      where: { id },
    });

    if (!ordemServico) {
      return null;
    }

    return OrdemServicoMapper.toEntityFromPrisma(ordemServico);
  }
}
