export interface OrdemServico {
  id: string;
  cliente: string;
  veiculo: string;
  problemaRelatado: string;
  diagnosticoMecanico?: string | null;
  itensOrcamento?: { descricao: string; valor: number }[] | null;
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | string;
  // O status foi atualizado para bater exatamente com a nossa Máquina de Estados no backend
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
