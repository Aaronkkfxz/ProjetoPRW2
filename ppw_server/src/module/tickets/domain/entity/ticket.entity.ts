import { BaseEntity, DefaulTimeStampsProps } from '../../../../shared/domain/entity/base.entity';
import { NivelPrioridade, Prioridade } from '../value-objects/prioridade.value.object';
import { Status } from '../value-objects/status.value.object';

// 1. Atualizamos a Tipagem com os campos da Oficina
export type TicketProps = {
  id: string;
  cliente: string;
  veiculo: string;
  problemaRelatado: string;
  diagnosticoMecanico?: string | null;
  itensOrcamento?: { descricao: string; valor: number }[] | null;
  prioridade: Prioridade;
  status: Status;
} & DefaulTimeStampsProps;

export class TicketEntity extends BaseEntity<TicketProps> {
  constructor(props: TicketProps) {
    super(props);
  }

  // 2. Método que o Use-Case chama para CRIAR uma nova O.S. do zero
  static createTicket(
    id: string,
    cliente: string,
    veiculo: string,
    problemaRelatado: string,
    prioridade: NivelPrioridade | string,
  ): TicketEntity {
    return new TicketEntity({
      id,
      cliente,
      veiculo,
      problemaRelatado,
      diagnosticoMecanico: null,
      itensOrcamento: null,
      prioridade: Prioridade.create(prioridade),
      // Todo novo ticket já entra no primeiro status da oficina
      status: Status.create('ABERTURA_DIAGNOSTICO'),
    });
  }

  // 3. Método que o Repository chama para MONTAR a O.S. que vem do Banco de Dados
  static restoreTicket(
    id: string,
    cliente: string,
    veiculo: string,
    problemaRelatado: string,
    prioridade: string,
    status: string,
    diagnosticoMecanico?: string | null,
    itensOrcamento?: any,
  ): TicketEntity {
    return new TicketEntity({
      id,
      cliente,
      veiculo,
      problemaRelatado,
      diagnosticoMecanico,
      itensOrcamento,
      prioridade: Prioridade.create(prioridade),
      status: Status.create(status),
    });
  }
}
