import { Controller, Get, Inject } from '@nestjs/common';
import { TicketResponse } from '../application/dto/ticket.dto.response';
import { FIND_ALL_TICKET_USE_CASE, FindAllTicketUseCase } from '../application/use-case/read/findall.ticket.use-case';

@Controller('ticket')
export class FindAllTicketController {
  constructor(
    @Inject(FIND_ALL_TICKET_USE_CASE)
    private readonly serviceUseCase: FindAllTicketUseCase,
  ) {}

  @Get()
  async findAllTickets(): Promise<TicketResponse[]> {
    return await this.serviceUseCase.execute();
  }
}
