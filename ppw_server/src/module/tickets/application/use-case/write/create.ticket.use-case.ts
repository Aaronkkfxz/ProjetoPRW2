import { TicketRequest } from "../../dto/ticket.dto.request";
import { TicketResponse } from "../../dto/ticket.dto.response";

export const CREATE_TICKET_USE_CASE = 'CREATE_TICKET_USE_CASE';

export interface CreateTicketUseCase {
  execute(ticket: TicketRequest): Promise<TicketResponse>;
}
