export async function fetchTicket() {
  try {
    const res = await fetch('http://localhost:8000/v1/ticket', {
      cache: 'no-store',
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
