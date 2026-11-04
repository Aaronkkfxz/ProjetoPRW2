import { Inject, Injectable } from '@nestjs/common';
import { TICKET_WRITE_REPOSITORY, TicketWriteRepository } from '../../../domain/ports/ticket.write.repository';
import { TicketMapper } from '../../../infrastructure/mappers/ticket.mappers';
import { TicketRequest } from '../../dto/ticket.dto.request';
import { TicketResponse } from '../../dto/ticket.dto.response';
import { CreateTicketUseCase } from '../../use-case/write/create.ticket.use-case';

@Injectable()
export class CreateTicketService implements CreateTicketUseCase {
  constructor(
    @Inject(TICKET_WRITE_REPOSITORY)
    private readonly repository: TicketWriteRepository,
  ) {}

  async execute(ticket: TicketRequest): Promise<TicketResponse> {
    const ticketEntity = TicketMapper.toTicketEntityFromRequest(ticket);
    const createdTicket = await this.repository.createTicket(ticketEntity);

    if (!createdTicket) {
      throw new Error('Erro ao criar a Ordem de Serviço no banco de dados.');
    }
    return TicketMapper.toTicketResponseFromTicketEntity(createdTicket);
  }
}
