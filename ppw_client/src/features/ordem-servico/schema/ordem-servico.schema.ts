import { z } from 'zod';

export const ordemServicoSchema = z.object({
  id: z.string().optional(),

  cliente: z
    .string()
    .min(3, 'O nome do cliente deve conter pelo menos três caracteres.')
    .max(50, 'O nome do cliente deve conter no máximo cinquenta caracteres.'),

  veiculo: z
    .string()
    .min(2, 'O veículo deve ter no mínimo dois caracteres.')
    .max(50, 'O veículo deve conter no máximo cinquenta caracteres.'),

  problemaRelatado: z
    .string()
    .min(5, 'O problema relatado deve ter no mínimo cinco caracteres.')
    .max(255, 'O problema relatado deve ter no máximo 255 caracteres.'),

  prioridade: z.enum(['BAIXA', 'MEDIA', 'ALTA'], {
    message: 'Selecione uma prioridade válida',
  }),

  // O status não é obrigatório na criação inicial (o backend define o padrão),
  // mas é essencial tê-lo no schema para validar edições posteriores.
  status: z
    .enum([
      'ABERTURA_DIAGNOSTICO',
      'AGUARDANDO_APROVACAO',
      'AGUARDANDO_PECAS',
      'EXECUCAO_TRABALHO',
      'CONCLUIDO',
      'ENTREGUE',
    ])
    .optional(),
});

export type OrdemServicoFormData = z.infer<typeof ordemServicoSchema>;
