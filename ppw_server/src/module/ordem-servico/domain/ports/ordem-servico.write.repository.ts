import { OrdemServicoEntity } from '../entity/ordem-servico.entity';
import { Status } from '../value-objects/status.value.object';

export const ORDEM_SERVICO_WRITE_REPOSITORY = 'ORDEM_SERVICO_WRITE_REPOSITORY';

export interface OrdemServicoWriteRepository {
  criarOrdemServico(entity: OrdemServicoEntity): Promise<OrdemServicoEntity | null>;

  updateOrdemServico(entity: OrdemServicoEntity): Promise<OrdemServicoEntity>;

  updateOrdemServicoStatus(id: string, status: Status): Promise<void>;

  deleteOrdemServico(id: string): Promise<void>;

  alocarPecaEFaturar(osId: string, pecaId: string, quantidadeUsada: number, autorId: string): Promise<void>;
}
