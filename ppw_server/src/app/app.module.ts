import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../database/prisma.module';
import { TicketModule } from '../module/tickets/tickets.module';

const modules = [PrismaModule, TicketModule];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ...modules,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
