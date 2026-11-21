import { BaseEntity, DefaulTimeStampsProps } from '../../../../shared/domain/entity/base.entity';
import { NivelPrioridade, Prioridade } from '../value-objects/prioridade.value.object';
import { Status } from '../value-objects/status.value.object';

export type OrdemServicoProps = {
  id: string;
  cliente: string;
  veiculo: string;
  problemaRelatado: string;
  diagnosticoMecanico?: string | null;
  itensOrcamento?: { descricao: string; valor: number }[] | null;
  prioridade: Prioridade;
  status: Status;
  // 1. Adicionamos o histórico aqui para ele não ser descartado
  historico?: any[];
} & DefaulTimeStampsProps;

export class OrdemServicoEntity extends BaseEntity<OrdemServicoProps> {
  constructor(props: OrdemServicoProps) {
    super(props);
  }

  static criarNova(
    id: string,
    cliente: string,
    veiculo: string,
    problemaRelatado: string,
    prioridade: NivelPrioridade | string,
  ): OrdemServicoEntity {
    return new OrdemServicoEntity({
      id,
      cliente,
      veiculo,
      problemaRelatado,
      diagnosticoMecanico: null,
      itensOrcamento: null,
      prioridade: Prioridade.create(prioridade),
      status: Status.create('ABERTURA_DIAGNOSTICO'),
    });
  }

  static restaurarDoBanco(
    id: string,
    cliente: string,
    veiculo: string,
    problemaRelatado: string,
    prioridade: string,
    status: string,
    diagnosticoMecanico?: string | null,
    itensOrcamento?: any,
    // 2. O método de restauração agora aceita o histórico
    historico?: any[],
  ): OrdemServicoEntity {
    return new OrdemServicoEntity({
      id,
      cliente,
      veiculo,
      problemaRelatado,
      diagnosticoMecanico,
      itensOrcamento,
      prioridade: Prioridade.create(prioridade),
      status: Status.create(status),
      historico,
    });
  }
}
