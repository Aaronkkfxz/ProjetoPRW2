import { Controller, Delete, Inject, Param } from '@nestjs/common';
import { DELETE_TICKET_USE_CASE, DeleteTicketUseCase } from '../application/use-case/write/delete.ticket.use-case';

@Controller('ticket')
export class DeleteTicketController {
  constructor(
    @Inject(DELETE_TICKET_USE_CASE)
    private readonly deleteTicketUseCase: DeleteTicketUseCase,
  ) {}

  @Delete(':id')
  async deleteTicket(@Param('id') id: string): Promise<void> {
    return await this.deleteTicketUseCase.execute(id);
  }
}
