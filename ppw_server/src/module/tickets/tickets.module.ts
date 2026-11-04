import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { FindAllTicketService } from './application/service/read/findall.ticket.service';
import { CreateTicketService } from './application/service/write/create.ticket.service';
import { DeleteTicketService } from './application/service/write/delete.ticket.service';
import { UpdateTicketService } from './application/service/write/update.ticket.service';
import { FIND_ALL_TICKET_USE_CASE } from './application/use-case/read/findall.ticket.use-case';
import { CREATE_TICKET_USE_CASE } from './application/use-case/write/create.ticket.use-case';
import { DELETE_TICKET_USE_CASE } from './application/use-case/write/delete.ticket.use-case';
import { UPDATE_TICKET_USE_CASE } from './application/use-case/write/update.ticket.use-case';
import { TICKET_READ_REPOSITORY } from './domain/ports/ticket.read.repository';
import { TICKET_WRITE_REPOSITORY } from './domain/ports/ticket.write.repository';
import { TicketPrismaReadRepository } from './infrastructure/adapters/ticket.prisma.read.repository';
import { TicketPrismaWriteRepository } from './infrastructure/adapters/ticket.prisma.write.repository';
import { CreateTcketController } from './presentation/create.ticket.controller';
import { FindAllTicketController } from './presentation/findall.ticket.controller';
import { DeleteTicketController } from './presentation/delete.ticket.controller';
import { UpdateTicketController } from './presentation/update.ticket.controller';

const ticketControllers = [
  CreateTcketController,
  FindAllTicketController,
  UpdateTicketController,
  DeleteTicketController,
];

const ticketProviders = [
  {
    provide: FIND_ALL_TICKET_USE_CASE,
    useClass: FindAllTicketService,
  },
  {
    provide: CREATE_TICKET_USE_CASE,
    useClass: CreateTicketService,
  },
  {
    provide: UPDATE_TICKET_USE_CASE,
    useClass: UpdateTicketService,
  },
  {
    provide: DELETE_TICKET_USE_CASE,
    useClass: DeleteTicketService,
  },
  {
    provide: TICKET_READ_REPOSITORY,
    useClass: TicketPrismaReadRepository,
  },
  {
    provide: TICKET_WRITE_REPOSITORY,
    useClass: TicketPrismaWriteRepository,
  },
];

@Module({
  imports: [PrismaModule],
  controllers: [...ticketControllers],
  providers: [...ticketProviders],
})
export class TicketModule {}
