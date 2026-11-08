import { OrdemServicoRequest } from '../../dto/ordem-servico.dto.request';
import { OrdemServicoResponse } from '../../dto/ordem-servico.dto.response';

export const CRIAR_ORDEM_SERVICO_USE_CASE = 'CRIAR_ORDEM_SERVICO_USE_CASE';

export interface CriarOrdemServicoUseCase {
  execute(request: OrdemServicoRequest): Promise<OrdemServicoResponse>;
}
