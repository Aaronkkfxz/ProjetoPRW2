import { Body, Controller, Param, Post } from '@nestjs/common';
import { FaturarOrdemServicoService } from '../application/service/write/faturar.ordem-servico.service';

@Controller('ordem-servico')
export class FaturarOrdemServicoController {
  constructor(private readonly faturarService: FaturarOrdemServicoService) {}

  @Post(':id/faturar')
  async faturar(
    @Param('id') osId: string,
    @Body('pecaId') pecaId: string,
    @Body('quantidadeUsada') quantidadeUsada: number,
  ) {
    await this.faturarService.execute(osId, pecaId, quantidadeUsada);
    return { success: true, message: 'Transação ACID concluída: Estoque baixado e OS faturada.' };
  }
}
