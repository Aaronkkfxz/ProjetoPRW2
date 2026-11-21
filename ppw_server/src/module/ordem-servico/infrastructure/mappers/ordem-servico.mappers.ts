import { OrdemServicoRequest } from '../../application/dto/ordem-servico.dto.request';
import { OrdemServicoResponse } from '../../application/dto/ordem-servico.dto.response';
import { OrdemServicoEntity } from '../../domain/entity/ordem-servico.entity';

export class OrdemServicoMapper {
  static toEntityFromRequest(request: OrdemServicoRequest) {
    return OrdemServicoEntity.criarNova(
      (request as any).id ?? '',
      request.cliente,
      request.veiculo,
      request.problemaRelatado,
      request.prioridade ?? 'BAIXA',
    );
  }

  static toEntityFromPrisma(raw: any) {
    return OrdemServicoEntity.restaurarDoBanco(
      raw.id,
      raw.cliente,
      raw.veiculo,
      raw.problemaRelatado,
      raw.prioridade,
      raw.status,
      raw.diagnosticoMecanico,
      raw.itensOrcamento,
      raw.historico,
    );
  }

  static toPrismaFromEntity(entity: OrdemServicoEntity) {
    return {
      // CORREÇÃO CRÍTICA AQUI: Se o ID for vazio (''), manda undefined.
      // Isso obriga o Prisma a usar o @default(uuid()) e gerar o ID automaticamente!
      id: entity.props.id === '' ? undefined : entity.props.id,

      cliente: entity.props.cliente,
      veiculo: entity.props.veiculo,
      problemaRelatado: entity.props.problemaRelatado,
      diagnosticoMecanico: entity.props.diagnosticoMecanico ?? null,
      itensOrcamento: entity.props.itensOrcamento ? JSON.parse(JSON.stringify(entity.props.itensOrcamento)) : null,
      prioridade: entity.props.prioridade.value,
      status: entity.props.status.value,
    };
  }

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
      deletedAt: entity.props.deleteAt,
      historico: entity.props.historico || [],
    };
  }

  static toListResponseFromListEntity(entities: OrdemServicoEntity[]): OrdemServicoResponse[] {
    return entities.map((entity) => this.toResponseFromEntity(entity));
  }

  static toListEntityFromListPrisma(rawList: any[]): OrdemServicoEntity[] {
    return rawList.map((raw) => this.toEntityFromPrisma(raw));
  }
}
