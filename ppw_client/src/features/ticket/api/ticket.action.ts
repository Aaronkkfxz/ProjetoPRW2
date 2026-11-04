'use server';

import { revalidatePath } from 'next/cache';
import { TicketFormData } from '../schema/ticket.schema';
import { ActionState, Ticket } from '../type/ticket.type';

const API_URL = 'http://localhost:8000/v1/ticket';

export async function createTicket(prevState: ActionState, ticket: TicketFormData): Promise<ActionState<Ticket>> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticket),
    });

    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        message: Array.isArray(data.message)
          ? data.message.join(', ')
          : data.message || 'Erro ao criar a Ordem de Serviço.',
      };
    }

    // Atualiza a tabela do front-end automaticamente
    revalidatePath('/');

    return {
      success: true,
      message: data.message ? data.message : 'Ordem de Serviço aberta com sucesso!',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Falha na conexão com o servidor.',
    };
  }
}

export async function updateTicket(
  prevState: ActionState,
  // Utilizamos Partial<Ticket> ou any porque o Update envia status e orçamentos, que não estão no TicketFormData de criação
  payload: { id: string; ticket: any },
): Promise<ActionState<Ticket>> {
  try {
    const response = await fetch(`${API_URL}/${payload.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload.ticket),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return {
        success: false,
        message: data.message || 'Erro ao atualizar a Ordem de Serviço.',
      };
    }

    revalidatePath('/');

    return {
      success: true,
      message: 'Ordem de Serviço atualizada com sucesso!',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Falha na conexão com o servidor.',
    };
  }
}

// Alterado para devolver um ActionState em caso de erro, mantendo o padrão Next.js
export async function deleteTicket(prevState: ActionState, id: string): Promise<ActionState> {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return {
        success: false,
        message: data.message || 'Erro ao excluir a Ordem de Serviço.',
      };
    }

    revalidatePath('/');

    return {
      success: true,
      message: 'Veículo removido da oficina com sucesso.',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Falha na conexão com o servidor.',
    };
  }
}
