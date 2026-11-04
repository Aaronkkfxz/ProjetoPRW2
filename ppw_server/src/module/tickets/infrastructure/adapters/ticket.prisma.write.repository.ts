import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { TicketEntity } from '../../domain/entity/ticket.entity';
import { TicketWriteRepository } from '../../domain/ports/ticket.write.repository';
import { Status } from '../../domain/value-objects/status.value.object';
import { TicketMapper } from '../mappers/ticket.mappers';

@Injectable()
export class TicketPrismaWriteRepository implements TicketWriteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createTicket(ticketEntity: TicketEntity): Promise<TicketEntity | null> {
    const data = TicketMapper.toTicketFromTicketEntity(ticketEntity);
    const ticketCreated = await this.prisma.ticket.create({ data: data as any });
    return TicketMapper.toTicketEntityFromTicketPrisma(ticketCreated as any);
  }

  async updateticket(ticketEntity: TicketEntity): Promise<TicketEntity> {
    const data = TicketMapper.toTicketFromTicketEntity(ticketEntity);

    const ticketUpdated = await this.prisma.ticket.update({
      where: { id: ticketEntity.props.id },
      data: {
        status: data.status as any,
        diagnosticoMecanico: data.diagnosticoMecanico,
        itensOrcamento: data.itensOrcamento as any,
      },
    });

    return TicketMapper.toTicketEntityFromTicketPrisma(ticketUpdated as any);
  }

  async updateTicketStatus(id: string, status: Status): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async deleteTicket(id: string): Promise<void> {
    await this.prisma.ticket.delete({
      where: { id },
    });
  }
}
