import { OrdemServicoProps } from '../../domain/entity/ordem-servico.entity';
import { NivelPrioridade } from '../../domain/value-objects/prioridade.value.object';
import { OrdemServicoStatusEnum } from '../../domain/value-objects/status.value.object';

export class OrdemServicoResponse {
  id?: string;
  cliente!: string;
  veiculo!: string;
  problemaRelatado!: string;
  diagnosticoMecanico?: string | null;
  itensOrcamento?: { descricao: string; valor: number }[] | null;
  prioridade!: NivelPrioridade | string;
  status!: OrdemServicoStatusEnum | string;
  createdAt?: Date | null;
  updateAt?: Date | null;
  deletedAt?: Date | null;

  constructor(props: Partial<OrdemServicoProps>) {
    Object.assign(this, props);
  }
}
