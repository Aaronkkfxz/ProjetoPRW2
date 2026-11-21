import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { OrdemServicoEntity } from '../../domain/entity/ordem-servico.entity';
import { OrdemServicoReadRepository } from '../../domain/ports/ordem-servico.read.repository';
import { OrdemServicoMapper } from '../mappers/ordem-servico.mappers';

@Injectable()
export class OrdemServicoPrismaReadRepository implements OrdemServicoReadRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOrdemServicoAll(): Promise<OrdemServicoEntity[]> {
    const ordensServico = await this.prisma.ordemServico.findMany({
      orderBy: { createdAt: 'desc' },
      // Traz o log auditado ordenado do mais recente ao mais antigo
      include: {
        historico: {
          orderBy: { timestamp: 'desc' },
        },
      },
    });

    return OrdemServicoMapper.toListEntityFromListPrisma(ordensServico);
  }

  async findOrdemServicoById(id: string): Promise<OrdemServicoEntity | null> {
    const ordemServico = await this.prisma.ordemServico.findUnique({
      where: { id },
      include: {
        historico: {
          orderBy: { timestamp: 'desc' },
        },
      },
    });

    if (!ordemServico) {
      return null;
    }

    return OrdemServicoMapper.toEntityFromPrisma(ordemServico);
  }
}
