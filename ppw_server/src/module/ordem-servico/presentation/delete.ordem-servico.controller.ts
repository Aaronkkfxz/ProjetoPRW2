import { Controller, Delete, Inject, Param } from '@nestjs/common';
import {
  DELETE_ORDEM_SERVICO_USE_CASE,
  DeleteOrdemServicoUseCase,
} from '../application/use-case/write/delete.ordem-servico.use-case';

@Controller('ordem-servico')
export class DeleteOrdemServicoController {
  constructor(
    @Inject(DELETE_ORDEM_SERVICO_USE_CASE)
    private readonly deleteOrdemServicoUseCase: DeleteOrdemServicoUseCase,
  ) {}

  @Delete(':id')
  async deleteOrdemServico(@Param('id') id: string): Promise<void> {
    return await this.deleteOrdemServicoUseCase.execute(id);
  }
}
