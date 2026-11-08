import { OrdemServico } from '../type/ordem-servico.type';

// Mantém a porta 8000 que estava a usar na imagem, ou pega da variável de ambiente
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function fetchOrdensServico(): Promise<OrdemServico[]> {
  try {
    // Aponta para a nova rota configurada no NestJS
    const res = await fetch(`${API_URL}/ordem-servico`, {
      cache: 'no-store', // Garante que a tabela carrega sempre os dados mais recentes do banco
    });

    if (!res.ok) {
      console.error('Erro na API:', res.status, res.statusText);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error('Falha ao conectar com o back-end:', error);
    return [];
  }
}
