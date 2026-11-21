import { Body, Controller, Inject, Param, Patch } from '@nestjs/common';
import { OrdemServicoResponse } from '../application/dto/ordem-servico.dto.response';
import {
  UPDATE_ORDEM_SERVICO_USE_CASE,
  UpdateOrdemServicoUseCase,
} from '../application/use-case/write/update.ordem-servico.use-case';

@Controller('ordem-servico')
export class UpdateOrdemServicoController {
  constructor(
    @Inject(UPDATE_ORDEM_SERVICO_USE_CASE)
    private readonly updateOrdemServicoUseCase: UpdateOrdemServicoUseCase,
  ) {}

  // Define que a rota precisa obrigatoriamente de um ID
  @Patch(':id')
  async updateOrdemServico(
    @Param('id') id: string,
    @Body() updateData: any, // O payload vem do frontend
  ): Promise<OrdemServicoResponse> {
    return await this.updateOrdemServicoUseCase.execute(id, updateData);
  }
}
