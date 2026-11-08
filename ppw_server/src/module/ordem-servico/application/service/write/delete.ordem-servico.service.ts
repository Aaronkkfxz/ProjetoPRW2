import { Inject, Injectable } from '@nestjs/common';
import {
  ORDEM_SERVICO_WRITE_REPOSITORY,
  OrdemServicoWriteRepository,
} from '../../../domain/ports/ordem-servico.write.repository';
import { DeleteOrdemServicoUseCase } from '../../use-case/write/delete.ordem-servico.use-case';

@Injectable()
export class DeleteOrdemServicoService implements DeleteOrdemServicoUseCase {
  constructor(
    @Inject(ORDEM_SERVICO_WRITE_REPOSITORY)
    private readonly writeRepository: OrdemServicoWriteRepository,
  ) {}

  async execute(id: string): Promise<void> {
    await this.writeRepository.deleteOrdemServico(id);
  }
}
