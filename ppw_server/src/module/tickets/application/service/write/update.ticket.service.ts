import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TICKET_READ_REPOSITORY, TicketReadRepository } from '../../../domain/ports/ticket.read.repository';
import { TICKET_WRITE_REPOSITORY, TicketWriteRepository } from '../../../domain/ports/ticket.write.repository';
import { TicketMapper } from '../../../infrastructure/mappers/ticket.mappers';
import { TicketResponse } from '../../dto/ticket.dto.response';
import { UpdateTicketUseCase } from '../../use-case/write/update.ticket.use-case';

@Injectable()
export class UpdateTicketService implements UpdateTicketUseCase {
  constructor(
    @Inject(TICKET_WRITE_REPOSITORY)
    private readonly writeRepository: TicketWriteRepository,
    @Inject(TICKET_READ_REPOSITORY)
    private readonly readRepository: TicketReadRepository,
  ) {}

  async execute(id: string, updateData: any): Promise<TicketResponse> {
    // 1. Busca o ticket existente
    const rawTicket = await this.readRepository.findticketById(id);
    if (!rawTicket) {
      throw new NotFoundException(`Ordem de serviço com ID ${id} não encontrada.`);
    }

    // 2. Transforma para entidade para podermos manipular
    const ticketEntity = TicketMapper.toTicketEntityFromTicketPrisma(rawTicket as any);

    // 3. Atualiza os dados permitidos
    if (updateData.status) ticketEntity.props.status = updateData.status;
    if (updateData.diagnosticoMecanico) ticketEntity.props.diagnosticoMecanico = updateData.diagnosticoMecanico;
    if (updateData.itensOrcamento) ticketEntity.props.itensOrcamento = updateData.itensOrcamento;

    const updatedTicket = await this.writeRepository.updateticket(ticketEntity);

    // Retorna para o Front-end
    return TicketMapper.toTicketResponseFromTicketEntity(updatedTicket);
  }
}
