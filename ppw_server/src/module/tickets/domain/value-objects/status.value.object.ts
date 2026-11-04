import { ValueObjects } from '../../../../shared/domain/value.objects/value.objects';

export enum TicketStatusEnum {
  ABERTO = 'ABERTO',
  CONCLUIDO = 'CONCLUIDO',
}

export class Status extends ValueObjects<TicketStatusEnum> {
  private constructor(value: TicketStatusEnum) {
    super(value);
  }

  static create(value: unknown): Status {
    if (typeof value !== 'string' || !value.trim()) {
      throw new Error('O status deve ser um texto preenchido');
    }

    const normalized = value.trim().toUpperCase() as TicketStatusEnum;

    if (!Object.values(TicketStatusEnum).includes(normalized)) {
      const permitidos = Object.values(TicketStatusEnum).join(', ');
      throw new Error(`Status Inválido: "${value}". Valores permitidos: ${permitidos}  `);
    }

    return new Status(normalized);
  }

  static aberto(): Status {
    return new Status(TicketStatusEnum.ABERTO);
  }

  static concluido(): Status {
    return new Status(TicketStatusEnum.CONCLUIDO);
  }

  isAberto(): boolean {
    return this.value === TicketStatusEnum.ABERTO;
  }

  isConcluido(): boolean {
    return this.value === TicketStatusEnum.CONCLUIDO;
  }
}
