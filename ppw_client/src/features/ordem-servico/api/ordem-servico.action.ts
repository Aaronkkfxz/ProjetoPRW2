'use server';

import { revalidatePath } from 'next/cache';
import { OrdemServicoFormData, ordemServicoSchema } from '../schema/ordem-servico.schema';
import { ActionState, OrdemServico } from '../type/ordem-servico.type';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// 1. CORREÇÃO DA CRIAÇÃO: Extrai os dados corretamente do FormData nativo
export async function createOrdemServico(
  prevState: ActionState<OrdemServico>,
  data: OrdemServicoFormData | FormData,
): Promise<ActionState<OrdemServico>> {
  try {
    const rawData = data instanceof FormData ? Object.fromEntries(data) : data;
    const validatedData = ordemServicoSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: 'Erro de validação nos dados enviados.',
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    const response = await fetch(`${API_URL}/ordem-servico`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedData.data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { success: false, message: errorData?.message || 'Erro ao criar a O.S.' };
    }

    revalidatePath('/');
    revalidatePath('/ordem-servico');
    return { success: true, message: 'Ordem de Serviço criada com sucesso!' };
  } catch (error) {
    return { success: false, message: 'Erro de comunicação com o servidor.' };
  }
}

// 2. CORREÇÃO DO MODAL: A URL da requisição agora recebe o ID corretamente
export async function updateOrdemServicoAction(id: string, updateData: any) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  try {
    const response = await fetch(`${API_URL}/ordem-servico/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { success: false, message: errorData?.message || 'Erro ao avançar etapa.' };
    }

    revalidatePath('/');
    return { success: true, message: 'Status atualizado com sucesso!' };
  } catch (error) {
    return { success: false, message: 'Erro na requisição de atualização.' };
  }
}

export async function faturarOrdemServicoAction(osId: string, pecaId: string, quantidadeUsada: number) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  try {
    const response = await fetch(`${API_URL}/ordem-servico/${osId}/faturar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pecaId, quantidadeUsada }),
    });

    if (!response.ok) {
      return { success: false, message: 'Erro ao faturar.' };
    }
    revalidatePath('/');
    return { success: true, message: 'Transação ACID concluída!' };
  } catch (error) {
    return { success: false, message: 'Erro de comunicação.' };
  }
}
