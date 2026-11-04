import { Inject, Injectable } from '@nestjs/common';
import { TICKET_READ_REPOSITORY, TicketReadRepository } from '../../../domain/ports/ticket.read.repository';
import { TicketMapper } from '../../../infrastructure/mappers/ticket.mappers';
import { TicketResponse } from '../../dto/ticket.dto.response';
import { FindAllTicketUseCase } from '../../use-case/read/findall.ticket.use-case';

@Injectable()
export class FindAllTicketService implements FindAllTicketUseCase {
  constructor(
    @Inject(TICKET_READ_REPOSITORY)
    private readonly repository: TicketReadRepository,
  ) {}

  async execute(): Promise<TicketResponse[]> {
    const ticketEntity = await this.repository.findTicketAll();
    return TicketMapper.toListTicketResponseFromListTicketEntity(ticketEntity);
  }
}
