'use server';

import { revalidatePath } from 'next/cache';
import { OrdemServicoFormData, ordemServicoSchema } from '../schema/ordem-servico.schema';
import { ActionState, OrdemServico } from '../type/ordem-servico.type';

// Ajuste a porta se o seu NestJS estiver a rodar numa porta diferente
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function createOrdemServico(
  prevState: ActionState<OrdemServico>,
  data: OrdemServicoFormData,
): Promise<ActionState<OrdemServico>> {
  try {
    // 1. Validação de segurança no servidor (Server-side validation)
    const validatedData = ordemServicoSchema.safeParse(data);

    if (!validatedData.success) {
      return {
        success: false,
        message: 'Erro de validação nos dados enviados.',
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    // 2. Chamada para a nova rota do backend NestJS
    const response = await fetch(`${API_URL}/ordem-servico`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData.data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        success: false,
        message: errorData?.message || 'Erro ao criar a Ordem de Serviço no servidor.',
      };
    }

    const responseData = await response.json();

    // 3. Revalida a página atual para a tabela atualizar automaticamente com a nova O.S.
    revalidatePath('/');
    revalidatePath('/ordem-servico');
    return {
      success: true,
      message: 'Ordem de Serviço criada com sucesso!',
      data: responseData,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Erro de comunicação com o servidor. Verifique se o backend está a rodar.',
    };
  }
}
