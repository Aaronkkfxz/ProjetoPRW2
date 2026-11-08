export const DELETE_ORDEM_SERVICO_USE_CASE = 'DELETE_ORDEM_SERVICO_USE_CASE';

export interface DeleteOrdemServicoUseCase {
  execute(id: string): Promise<void>;
}
