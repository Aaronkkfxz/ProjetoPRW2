import { Controller, Get, Inject } from '@nestjs/common';
import { OrdemServicoResponse } from '../application/dto/ordem-servico.dto.response';
import {
  FIND_ALL_ORDEM_SERVICO_USE_CASE,
  FindAllOrdemServicoUseCase,
} from '../application/use-case/read/findall.ticket.use-case';

@Controller('ordem-servico')
export class FindAllOrdemServicoController {
  constructor(
    @Inject(FIND_ALL_ORDEM_SERVICO_USE_CASE)
    private readonly serviceUseCase: FindAllOrdemServicoUseCase,
  ) {}

  @Get()
  async findAllOrdemServico(): Promise<OrdemServicoResponse[]> {
    return await this.serviceUseCase.execute();
  }
}
