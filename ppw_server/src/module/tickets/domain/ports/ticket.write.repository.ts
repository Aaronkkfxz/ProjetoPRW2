import { TicketEntity } from '../entity/ticket.entity';
import { Status } from '../value-objects/status.value.object';

export const TICKET_WRITE_REPOSITORY = 'TICKET_WRITE_REPOSITORY';

export interface TicketWriteRepository {
  createTicket(ticketEntity: TicketEntity): Promise<TicketEntity | null>;

  updateticket(ticketEntity: TicketEntity): Promise<TicketEntity>;

  updateTicketStatus(id: string, status: Status): Promise<void>;

  deleteTicket(id: string): Promise<void>;
}
