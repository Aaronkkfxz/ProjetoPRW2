import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';

// 1. Importar Controladores
import { CreateOrdemServicoController } from './presentation/create.ordem-servico.controller';
import { DeleteOrdemServicoController } from './presentation/delete.ordem-servico.controller';
import { FindAllOrdemServicoController } from './presentation/findall.ordem-servico.controller';
import { UpdateOrdemServicoController } from './presentation/update.ordem-servico.controller';
// 2. Importar Casos de Uso (Tokens / Interfaces)

import { CRIAR_ORDEM_SERVICO_USE_CASE } from './application/use-case/write/create.ordem-servico.use-case';
import { DELETE_ORDEM_SERVICO_USE_CASE } from './application/use-case/write/delete.ordem-servico.use-case';
import { UPDATE_ORDEM_SERVICO_USE_CASE } from './application/use-case/write/update.ordem-servico.use-case';

// 3. Importar Serviços (Implementações)

import { CriarOrdemServicoService } from './application/service/write/create.ordem-servico.service';
import { DeleteOrdemServicoService } from './application/service/write/delete.ordem-servico.service';
import { UpdateOrdemServicoService } from './application/service/write/update.ordem-servico.service';

// 4. Importar Repositórios (Ports e Adapters)
import { FindAllOrdemServicoService } from './application/service/read/findall.oderm-servico.service';
import { FIND_ALL_ORDEM_SERVICO_USE_CASE } from './application/use-case/read/findall.ticket.use-case';
import { ORDEM_SERVICO_READ_REPOSITORY } from './domain/ports/ordem-servico.read.repository';
import { ORDEM_SERVICO_WRITE_REPOSITORY } from './domain/ports/ordem-servico.write.repository';
import { OrdemServicoPrismaReadRepository } from './infrastructure/adapters/ordem-servico.prisma.read.repository';
import { OrdemServicoPrismaWriteRepository } from './infrastructure/adapters/ordem-servico.prisma.write.repository';

const ordemServicoControllers = [
  CreateOrdemServicoController,
  FindAllOrdemServicoController,
  UpdateOrdemServicoController,
  DeleteOrdemServicoController,
];

const ordemServicoProviders = [
  // Injeção dos Casos de Uso
  {
    provide: CRIAR_ORDEM_SERVICO_USE_CASE,
    useClass: CriarOrdemServicoService,
  },
  {
    provide: UPDATE_ORDEM_SERVICO_USE_CASE,
    useClass: UpdateOrdemServicoService,
  },
  {
    provide: DELETE_ORDEM_SERVICO_USE_CASE,
    useClass: DeleteOrdemServicoService,
  },
  {
    provide: FIND_ALL_ORDEM_SERVICO_USE_CASE,
    useClass: FindAllOrdemServicoService,
  },

  // Injeção dos Repositórios de Banco de Dados
  {
    provide: ORDEM_SERVICO_READ_REPOSITORY,
    useClass: OrdemServicoPrismaReadRepository,
  },
  {
    provide: ORDEM_SERVICO_WRITE_REPOSITORY,
    useClass: OrdemServicoPrismaWriteRepository,
  },
];

@Module({
  imports: [PrismaModule],
  controllers: [...ordemServicoControllers],
  providers: [...ordemServicoProviders],
})
export class OrdemServicoModule {}
