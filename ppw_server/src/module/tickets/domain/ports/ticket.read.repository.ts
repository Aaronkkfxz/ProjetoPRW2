import { TicketEntity } from '../entity/ticket.entity';

export const TICKET_READ_REPOSITORY = 'TICKET_READ_REPOSITORY';

export interface TicketReadRepository {
  findTicketAll(): Promise<TicketEntity[]>;
  findticketById(id: string): Promise<TicketEntity | null>;
}
