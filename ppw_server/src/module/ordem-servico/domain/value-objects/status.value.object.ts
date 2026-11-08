import { ValueObjects } from '../../../../shared/domain/value.objects/value.objects';

// 1. Atualizamos o Enum para refletir as etapas da Oficina
export enum OrdemServicoStatusEnum {
  ABERTURA_DIAGNOSTICO = 'ABERTURA_DIAGNOSTICO',
  AGUARDANDO_APROVACAO = 'AGUARDANDO_APROVACAO',
  AGUARDANDO_PECAS = 'AGUARDANDO_PECAS',
  EXECUCAO_TRABALHO = 'EXECUCAO_TRABALHO',
  CONCLUIDO = 'CONCLUIDO',
  ENTREGUE = 'ENTREGUE',
}

// 2. Renomeamos a classe de Status
export class Status extends ValueObjects<OrdemServicoStatusEnum> {
  private constructor(value: OrdemServicoStatusEnum) {
    super(value);
  }

  static create(value: unknown): Status {
    if (typeof value !== 'string' || !value.trim()) {
      throw new Error('O status deve ser um texto preenchido');
    }

    const normalized = value.trim().toUpperCase() as OrdemServicoStatusEnum;

    if (!Object.values(OrdemServicoStatusEnum).includes(normalized)) {
      const permitidos = Object.values(OrdemServicoStatusEnum).join(', ');
      throw new Error(`Status Inválido: "${value}". Valores permitidos: ${permitidos}`);
    }

    return new Status(normalized);
  }

  // Construtores rápidos úteis para a sua Máquina de Estados
  static aberturaDiagnostico(): Status {
    return new Status(OrdemServicoStatusEnum.ABERTURA_DIAGNOSTICO);
  }

  static aguardandoAprovacao(): Status {
    return new Status(OrdemServicoStatusEnum.AGUARDANDO_APROVACAO);
  }

  static aguardandoPecas(): Status {
    return new Status(OrdemServicoStatusEnum.AGUARDANDO_PECAS);
  }

  static execucaoTrabalho(): Status {
    return new Status(OrdemServicoStatusEnum.EXECUCAO_TRABALHO);
  }

  static concluido(): Status {
    return new Status(OrdemServicoStatusEnum.CONCLUIDO);
  }
}
