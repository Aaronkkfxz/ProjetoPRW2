import { Inject, Injectable } from '@nestjs/common';
import {
  ORDEM_SERVICO_WRITE_REPOSITORY,
  OrdemServicoWriteRepository,
} from '../../../domain/ports/ordem-servico.write.repository';
import { OrdemServicoMapper } from '../../../infrastructure/mappers/ordem-servico.mappers';
import { OrdemServicoRequest } from '../../dto/ordem-servico.dto.request';
import { OrdemServicoResponse } from '../../dto/ordem-servico.dto.response';
import { CriarOrdemServicoUseCase } from '../../use-case/write/create.ordem-servico.use-case';

@Injectable()
export class CriarOrdemServicoService implements CriarOrdemServicoUseCase {
  constructor(
    @Inject(ORDEM_SERVICO_WRITE_REPOSITORY)
    private readonly repository: OrdemServicoWriteRepository,
  ) {}

  async execute(request: OrdemServicoRequest): Promise<OrdemServicoResponse> {
    const osEntity = OrdemServicoMapper.toEntityFromRequest(request);
    const osCriada = await this.repository.criarOrdemServico(osEntity);

    if (!osCriada) {
      throw new Error('Erro ao criar a Ordem de Serviço na base de dados.');
    }

    // O registo do Histórico (Audit Log) de "Criação" será adicionado aqui
    // dentro de uma transação Prisma.

    return OrdemServicoMapper.toResponseFromEntity(osCriada);
  }
}
