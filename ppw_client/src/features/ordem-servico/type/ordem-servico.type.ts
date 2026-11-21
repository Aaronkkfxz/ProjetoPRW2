export interface HistoricoOS {
  id: string;
  estado_anterior: string;
  novo_estado: string;
  autor_id: string;
  justificativa?: string;
  timestamp: string | Date;
}

export interface OrdemServico {
  id: string;
  cliente: string;
  veiculo: string;
  problemaRelatado: string;
  diagnosticoMecanico?: string | null;
  itensOrcamento?: { descricao: string; valor: number }[] | null;
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | string;
  status:
    | 'ABERTURA_DIAGNOSTICO'
    | 'AGUARDANDO_APROVACAO'
    | 'AGUARDANDO_PECAS'
    | 'EXECUCAO_TRABALHO'
    | 'CONCLUIDO'
    | 'ENTREGUE'
    | string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  deletedAt?: string | Date | null;
  historico?: HistoricoOS[];
}

export interface OrdemServicoFormDialogProps {
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

export const InitialActionOrdemServicoState: ActionState<OrdemServico> = {
  state: 0,
  success: false,
  message: '',
  data: undefined,
  errors: undefined,
};
