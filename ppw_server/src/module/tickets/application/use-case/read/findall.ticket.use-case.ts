import { TicketResponse } from '../../dto/ticket.dto.response';

export const FIND_ALL_TICKET_USE_CASE = 'FIND_ALL_TICKET_USE_CASE';

export interface FindAllTicketUseCase {
  execute(): Promise<TicketResponse[]>;
}
