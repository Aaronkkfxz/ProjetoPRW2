// 1. Atualizado para o novo nome do componente que exportamos
import OrdensServicoPage from '@/features/ordem-servico/components/OrdemServico';

// 2. Importação da nova função de fetch que criámos
import { fetchOrdensServico } from '@/features/ordem-servico/api/fetch.ordem-servico';

export default async function Pages() {
  // 3. Chamada à API refatorada
  const ordensServico = await fetchOrdensServico();

  console.log(ordensServico);

  // 4. Passagem de parâmetros usando a prop correta (ordensServico)
  return <OrdensServicoPage ordensServico={ordensServico} />;
}
