import { TicketResponse } from '../../dto/ticket.dto.response';

export const UPDATE_TICKET_USE_CASE = 'UPDATE_TICKET_USE_CASE';

export interface UpdateTicketUseCase {
  execute(id: string, updateData: any): Promise<TicketResponse>;
}
