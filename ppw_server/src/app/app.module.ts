import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../database/prisma.module';
import { OrdemServicoModule } from '../module/ordem-servico/ordem-servico.module';

const modules = [PrismaModule, OrdemServicoModule];

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
