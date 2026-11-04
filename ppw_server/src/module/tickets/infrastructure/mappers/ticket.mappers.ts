import { Ticket as PrismaTicket, Ticket } from '@prisma/client';
import { TicketRequest } from '../../application/dto/ticket.dto.request';
import { TicketResponse } from '../../application/dto/ticket.dto.response';
import { TicketEntity } from '../../domain/entity/ticket.entity';

export class TicketMapper {
  // 1. Traduz do Front-end (Request) para a Memória (Entity) na hora de criar
  static toTicketEntityFromRequest(request: TicketRequest) {
    return TicketEntity.createTicket(
      request.id ?? '',
      request.cliente,
      request.veiculo,
      request.problemaRelatado,
      request.prioridade ?? 'BAIXA',
    );
  }

  // 2. Traduz do Banco de Dados (Prisma) para a Memória (Entity) ao buscar
  static toTicketEntityFromTicketPrisma(raw: PrismaTicket) {
    return TicketEntity.restoreTicket(
      raw.id,
      raw.cliente,
      raw.veiculo,
      raw.problemaRelatado,
      raw.prioridade,
      raw.status,
      raw.diagnosticoMecanico,
      raw.itensOrcamento,
    );
  }

  // 3. Traduz da Memória (Entity) para o formato que o Banco de Dados (Prisma) exige salvar
  static toTicketFromTicketEntity(ticketEntity: TicketEntity) {
    return {
      id: ticketEntity.props.id,
      cliente: ticketEntity.props.cliente,
      veiculo: ticketEntity.props.veiculo,
      problemaRelatado: ticketEntity.props.problemaRelatado,
      diagnosticoMecanico: ticketEntity.props.diagnosticoMecanico ?? null,
      // Se houver orçamento, o Prisma salva como JSON nativo
      itensOrcamento: ticketEntity.props.itensOrcamento
        ? JSON.parse(JSON.stringify(ticketEntity.props.itensOrcamento))
        : null,
      prioridade: ticketEntity.props.prioridade.value,
      status: ticketEntity.props.status.value,
    };
  }

  // 4. Traduz da Memória (Entity) para devolver ao Front-end (Response)
  static toTicketResponseFromTicketEntity(ticketEntity: TicketEntity): TicketResponse {
    return {
      id: ticketEntity.props.id,
      cliente: ticketEntity.props.cliente,
      veiculo: ticketEntity.props.veiculo,
      problemaRelatado: ticketEntity.props.problemaRelatado,
      diagnosticoMecanico: ticketEntity.props.diagnosticoMecanico ?? null,
      itensOrcamento: ticketEntity.props.itensOrcamento ?? null,
      prioridade: ticketEntity.props.prioridade.value,
      status: ticketEntity.props.status.value,
    };
  }

  static toListTicketResponseFromListTicketEntity(entities: TicketEntity[]): TicketResponse[] {
    return entities.map((entity) => this.toTicketResponseFromTicketEntity(entity));
  }

  static toListTicketEntityFromListTicket(rawList: Ticket[]): TicketEntity[] {
    return rawList.map((raw) => this.toTicketEntityFromTicketPrisma(raw));
  }
}
