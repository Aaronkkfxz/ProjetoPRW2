import { OrdemServico, OrdemServico as PrismaOrdemServico } from '@prisma/client';
import { OrdemServicoRequest } from '../../application/dto/ordem-servico.dto.request';
import { OrdemServicoResponse } from '../../application/dto/ordem-servico.dto.response';
import { OrdemServicoEntity } from '../../domain/entity/ordem-servico.entity'; // Lembre-se de atualizar o nome deste arquivo de entidade futuramente

export class OrdemServicoMapper {
  // 1. Traduz do Front-end (Request) para a Memória (Entity) na hora de criar
  static toEntityFromRequest(request: OrdemServicoRequest) {
    return OrdemServicoEntity.criarNova(
      (request as any).id ?? '', // O ID costuma ser gerado automaticamente pelo banco, mas mantemos o fallback
      request.cliente,
      request.veiculo,
      request.problemaRelatado,
      request.prioridade ?? 'BAIXA',
    );
  }

  // 2. Traduz do Banco de Dados (Prisma) para a Memória (Entity) ao buscar
  static toEntityFromPrisma(raw: PrismaOrdemServico) {
    return OrdemServicoEntity.restaurarDoBanco(
      raw.id,
      raw.cliente,
      raw.veiculo,
      raw.problemaRelatado,
      raw.prioridade,
      raw.status,
      raw.diagnosticoMecanico,
      raw.itensOrcamento,
    );
  }

  // 3. Traduz da Memória (Entity) para o formato que o Banco de Dados (Prisma) exige salvar
  static toPrismaFromEntity(entity: OrdemServicoEntity) {
    return {
      id: entity.props.id,
      cliente: entity.props.cliente,
      veiculo: entity.props.veiculo,
      problemaRelatado: entity.props.problemaRelatado,
      diagnosticoMecanico: entity.props.diagnosticoMecanico ?? null,
      // Se houver orçamento, o Prisma salva como JSON nativo
      itensOrcamento: entity.props.itensOrcamento ? JSON.parse(JSON.stringify(entity.props.itensOrcamento)) : null,
      prioridade: entity.props.prioridade.value,
      status: entity.props.status.value,
    };
  }

  // 4. Traduz da Memória (Entity) para devolver ao Front-end (Response)
  static toResponseFromEntity(entity: OrdemServicoEntity): OrdemServicoResponse {
    return {
      id: entity.props.id,
      cliente: entity.props.cliente,
      veiculo: entity.props.veiculo,
      problemaRelatado: entity.props.problemaRelatado,
      diagnosticoMecanico: entity.props.diagnosticoMecanico ?? null,
      itensOrcamento: entity.props.itensOrcamento ?? null,
      prioridade: entity.props.prioridade.value,
      status: entity.props.status.value,
      createdAt: entity.props.createdAt || new Date(),
      updateAt: entity.props.updateAt,
    };
  }

  static toListResponseFromListEntity(entities: OrdemServicoEntity[]): OrdemServicoResponse[] {
    return entities.map((entity) => this.toResponseFromEntity(entity));
  }

  static toListEntityFromListPrisma(rawList: OrdemServico[]): OrdemServicoEntity[] {
    return rawList.map((raw) => this.toEntityFromPrisma(raw));
  }
}
