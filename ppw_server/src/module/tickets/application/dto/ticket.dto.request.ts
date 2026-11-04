import { TicketProps } from '../../domain/entity/ticket.entity';

export class TicketRequest {
  id?: string;

  // Nossos campos da oficina
  cliente!: string;
  veiculo!: string;
  problemaRelatado!: string;
  diagnosticoMecanico?: string;

  // Itens do orçamento (pode vir como um array do front-end)
  itensOrcamento?: { descricao: string; valor: number }[];

  prioridade?: 'BAIXA' | 'MEDIA' | 'ALTA';
  status?: 'ABERTURA_DIAGNOSTICO' | 'APROVACAO_ORCAMENTO' | 'EXECUCAO_TRABALHO' | 'ENTREGA_CARRO';

  constructor(props: Partial<TicketProps>) {
    Object.assign(this, props);
  }
}
