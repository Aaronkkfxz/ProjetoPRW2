import { TicketProps } from '../../domain/entity/ticket.entity';
import { NivelPrioridade } from '../../domain/value-objects/prioridade.value.object';
import { TicketStatusEnum } from '../../domain/value-objects/status.value.object';

export class TicketResponse {
  id?: string;
  cliente!: string;
  veiculo!: string;
  problemaRelatado!: string;
  diagnosticoMecanico?: string | null;
  itensOrcamento?: { descricao: string; valor: number }[] | null;
  prioridade!: NivelPrioridade | string;
  status!: TicketStatusEnum | string;
  createdAt?: Date | null;
  updateAt?: Date | null;
  deletedAt?: Date | null;

  constructor(props: Partial<TicketProps>) {
    Object.assign(this, props);
  }
}
