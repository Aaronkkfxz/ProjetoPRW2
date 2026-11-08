import { OrdemServicoEntity } from '../entity/ordem-servico.entity';

export const ORDEM_SERVICO_READ_REPOSITORY = 'ORDEM_SERVICO_READ_REPOSITORY';

export interface OrdemServicoReadRepository {
  // Renomeado para coincidir com a chamada no Serviço
  findOrdemServicoAll(): Promise<OrdemServicoEntity[]>;

  // Renomeado para manter o padrão
  findOrdemServicoById(id: string): Promise<OrdemServicoEntity | null>;
}
