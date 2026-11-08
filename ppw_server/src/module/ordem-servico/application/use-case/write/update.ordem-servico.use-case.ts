import { OrdemServicoResponse } from '../../dto/ordem-servico.dto.response';

export const UPDATE_ORDEM_SERVICO_USE_CASE = 'UPDATE_ORDEM_SERVICO_USE_CASE';

export interface UpdateOrdemServicoUseCase {
  execute(id: string, updateData: any): Promise<OrdemServicoResponse>;
}
