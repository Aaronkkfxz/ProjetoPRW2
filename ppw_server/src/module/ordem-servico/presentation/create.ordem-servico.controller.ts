import { Body, Controller, Inject, Post } from '@nestjs/common';
import { OrdemServicoRequest } from '../application/dto/ordem-servico.dto.request';
import { OrdemServicoResponse } from '../application/dto/ordem-servico.dto.response';
import {
  CRIAR_ORDEM_SERVICO_USE_CASE,
  CriarOrdemServicoUseCase,
} from '../application/use-case/write/create.ordem-servico.use-case';

@Controller('ordem-servico')
export class CreateOrdemServicoController {
  constructor(
    @Inject(CRIAR_ORDEM_SERVICO_USE_CASE)
    private readonly criarOrdemServicoUseCase: CriarOrdemServicoUseCase,
  ) {}

  @Post()
  async createOrdemServico(@Body() createRequest: OrdemServicoRequest): Promise<OrdemServicoResponse> {
    return await this.criarOrdemServicoUseCase.execute(createRequest);
  }
}
