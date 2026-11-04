import { success } from 'zod';

export interface Ticket {
  id: string;
  cliente: string;
  veiculo: string;
  problemaRelatado: string;
  diagnosticoMecanico?: string | null;
  itensOrcamento?: { descricao: string; valor: number }[] | null;
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | string;
  status: 'ABERTURA_DIAGNOSTICO' | 'APROVACAO_ORCAMENTO' | 'EXECUCAO_TRABALHO' | 'ENTREGA_CARRO' | string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  deletedAt?: string | Date | null;
}

export interface TicketFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface ActionState<T = unknown> {
  state?: number;
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export const InitialActionTicketState: ActionState<Ticket> = {
  state: 0,
  success: false,
  message: '',
  data: undefined,
  errors: undefined,
};
