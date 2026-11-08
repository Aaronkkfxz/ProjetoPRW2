import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  ORDEM_SERVICO_READ_REPOSITORY,
  OrdemServicoReadRepository,
} from '../../../domain/ports/ordem-servico.read.repository';
import {
  ORDEM_SERVICO_WRITE_REPOSITORY,
  OrdemServicoWriteRepository,
} from '../../../domain/ports/ordem-servico.write.repository';
import { OrdemServicoMapper } from '../../../infrastructure/mappers/ordem-servico.mappers';
import { OrdemServicoResponse } from '../../dto/ordem-servico.dto.response';
import { UpdateOrdemServicoUseCase } from '../../use-case/write/update.ordem-servico.use-case';

@Injectable()
export class UpdateOrdemServicoService implements UpdateOrdemServicoUseCase {
  constructor(
    @Inject(ORDEM_SERVICO_WRITE_REPOSITORY)
    private readonly writeRepository: OrdemServicoWriteRepository,

    // Corrigido para apontar para a injeção do READ (estava duplicando o WRITE na sua versão)
    @Inject(ORDEM_SERVICO_READ_REPOSITORY)
    private readonly readRepository: OrdemServicoReadRepository,
  ) {}

  async execute(id: string, updateData: any): Promise<OrdemServicoResponse> {
    // 1. Busca a Ordem de Serviço existente usando o método que renomeamos anteriormente
    const rawOs = await this.readRepository.findOrdemServicoById(id);
    if (!rawOs) {
      throw new NotFoundException(`Ordem de serviço com ID ${id} não encontrada.`);
    }

    // 2. O rawOs já retorna como Entidade se o ReadRepository estiver correto,
    //    mas mantemos o mapeamento caso venha direto do Prisma
    const osEntity = rawOs;

    // 3. Atualiza os dados permitidos
    if (updateData.status) osEntity.props.status = updateData.status;
    if (updateData.diagnosticoMecanico) osEntity.props.diagnosticoMecanico = updateData.diagnosticoMecanico;
    if (updateData.itensOrcamento) osEntity.props.itensOrcamento = updateData.itensOrcamento;

    // Atualizado para chamar o método correto no WriteRepository
    const updatedOs = await this.writeRepository.updateOrdemServico(osEntity);

    // Retorna para o Front-end
    return OrdemServicoMapper.toResponseFromEntity(updatedOs);
  }
}
