import { OrdemServicoResponse } from '../../dto/ordem-servico.dto.response';

export const FIND_ALL_ORDEM_SERVICO_USE_CASE = 'FIND_ALL_ORDEM_SERVICO_USE_CASE';

export interface FindAllOrdemServicoUseCase {
  execute(): Promise<OrdemServicoResponse[]>;
}
