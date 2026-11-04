import { Body, Controller, Inject, Param, Patch } from '@nestjs/common';
import { TicketResponse } from '../application/dto/ticket.dto.response';
import { UPDATE_TICKET_USE_CASE, UpdateTicketUseCase } from '../application/use-case/write/update.ticket.use-case';

@Controller('ticket')
export class UpdateTicketController {
  constructor(
    @Inject(UPDATE_TICKET_USE_CASE)
    private readonly updateTicketUseCase: UpdateTicketUseCase,
  ) {}

  @Patch(':id')
  async updateTicket(@Param('id') id: string, @Body() updateData: any): Promise<TicketResponse> {
    return await this.updateTicketUseCase.execute(id, updateData);
  }
}
