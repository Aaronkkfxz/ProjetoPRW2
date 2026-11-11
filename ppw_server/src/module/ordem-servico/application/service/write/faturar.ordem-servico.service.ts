import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  ORDEM_SERVICO_WRITE_REPOSITORY,
  OrdemServicoWriteRepository,
} from '../../../domain/ports/ordem-servico.write.repository';

@Injectable()
export class FaturarOrdemServicoService {
  constructor(
    @Inject(ORDEM_SERVICO_WRITE_REPOSITORY)
    private readonly repository: OrdemServicoWriteRepository,
  ) {}

  async execute(osId: string, pecaId: string, quantidadeUsada: number): Promise<void> {
    // Em um sistema real, o autorId viria do token JWT do usuário logado.
    // Para a avaliação, vamos fixar o mecânico que está operando o sistema.
    const autorId = 'mecanico-aaron-001';

    try {
      await this.repository.alocarPecaEFaturar(osId, pecaId, quantidadeUsada, autorId);
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }
}
