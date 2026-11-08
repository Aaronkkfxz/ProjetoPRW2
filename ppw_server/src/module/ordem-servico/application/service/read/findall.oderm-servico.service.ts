import { Inject, Injectable } from '@nestjs/common';
import { OrdemServicoMapper } from '../../../infrastructure/mappers/ordem-servico.mappers';

import { OrdemServicoResponse } from '../../dto/ordem-servico.dto.response';
import { FindAllOrdemServicoUseCase } from '../../use-case/read/findall.ticket.use-case';
import {
  ORDEM_SERVICO_READ_REPOSITORY,
  OrdemServicoReadRepository,
} from '../../../domain/ports/ordem-servico.read.repository';
// 1. Caminho de importação corrigido para a nova nomenclatura

@Injectable()
export class FindAllOrdemServicoService implements FindAllOrdemServicoUseCase {
  constructor(
    @Inject(ORDEM_SERVICO_READ_REPOSITORY)
    private readonly repository: OrdemServicoReadRepository,
  ) {}

  async execute(): Promise<OrdemServicoResponse[]> {
    // Busca a lista de entidades no banco de dados
    const ordensServico = await this.repository.findOrdemServicoAll();

    // 2. Método do Mapper atualizado para o nome correto que criámos
    return OrdemServicoMapper.toListResponseFromListEntity(ordensServico);
  }
}
