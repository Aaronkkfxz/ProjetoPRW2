export const DELETE_TICKET_USE_CASE = 'DELETE_TICKET_USE_CASE';

export interface DeleteTicketUseCase {
  execute(id: string): Promise<void>;
}
