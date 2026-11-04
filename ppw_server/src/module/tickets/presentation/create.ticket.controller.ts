import { Body, Controller, Inject, Post } from '@nestjs/common';
import { TicketRequest } from '../application/dto/ticket.dto.request';
import { TicketResponse } from '../application/dto/ticket.dto.response';
import { CREATE_TICKET_USE_CASE, CreateTicketUseCase } from '../application/use-case/write/create.ticket.use-case';

@Controller('ticket')
export class CreateTcketController {
  constructor(
    @Inject(CREATE_TICKET_USE_CASE)
    private readonly createTicketUseCase: CreateTicketUseCase,
  ) {}

  @Post()
  async createTicket(@Body() createRequest: TicketRequest): Promise<TicketResponse> {
    return await this.createTicketUseCase.execute(createRequest);
  }
}
