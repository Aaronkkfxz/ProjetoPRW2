import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';
import { TicketEntity } from '../../domain/entity/ticket.entity';
import { TicketReadRepository } from '../../domain/ports/ticket.read.repository';
import { TicketMapper } from '../mappers/ticket.mappers';

@Injectable()
export class TicketPrismaReadRepository implements TicketReadRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findTicketAll(): Promise<TicketEntity[]> {
    const ticket = await this.prisma.ticket.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return TicketMapper.toListTicketEntityFromListTicket(ticket);
  }

  findticketById(id: string): Promise<TicketEntity | null> {
    throw new Error('Method not implemented.');
  }
}
