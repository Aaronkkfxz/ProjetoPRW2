import { Inject, Injectable } from '@nestjs/common';
import { TICKET_WRITE_REPOSITORY, TicketWriteRepository } from '../../../domain/ports/ticket.write.repository';
import { DeleteTicketUseCase } from '../../use-case/write/delete.ticket.use-case';

@Injectable()
export class DeleteTicketService implements DeleteTicketUseCase {
  constructor(
    @Inject(TICKET_WRITE_REPOSITORY)
    private readonly writeRepository: TicketWriteRepository,
  ) {}

  async execute(id: string): Promise<void> {
    await this.writeRepository.deleteTicket(id);
  }
}
