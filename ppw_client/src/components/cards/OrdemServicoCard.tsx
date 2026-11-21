import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { faturarOrdemServicoAction } from '@/features/ordem-servico/api/ordem-servico.action';
import { OrdemServico } from '@/features/ordem-servico/type/ordem-servico.type';
import { useState } from 'react';

interface OrdemServicoCardProps {
  os: OrdemServico;
  onUpdate: (id: string, data: any) => void;
  onDelete: (id: string) => void;
}

export function OrdemServicoCard({ os, onUpdate, onDelete }: OrdemServicoCardProps) {
  const [diagnostico, setDiagnostico] = useState(os.diagnosticoMecanico || '');
  const [itens, setItens] = useState<any[]>(os.itensOrcamento || []);
  const [novaDescricao, setNovaDescricao] = useState('');
  const [novoValor, setNovoValor] = useState('');

  // 1. Definição da Máquina de Estados Finita (FSM)[cite: 14]
  const order = [
    'ABERTURA_DIAGNOSTICO',
    'AGUARDANDO_APROVACAO',
    'AGUARDANDO_PECAS',
    'EXECUCAO_TRABALHO',
    'CONCLUIDO',
    'ENTREGUE',
  ];

  // Identifica o status atual e calcula qual será a próxima etapa
  const currentIndex = order.indexOf(os.status);
  const nextStatus = currentIndex < order.length - 1 ? order[currentIndex + 1] : null;

  // Função para adicionar itens ao orçamento dinâmico
  const adicionarItem = () => {
    if (!novaDescricao || !novoValor) return;
    const valorNum = parseFloat(novoValor);
    if (isNaN(valorNum)) return;
    setItens([...itens, { descricao: novaDescricao, valor: valorNum }]);
    setNovaDescricao('');
    setNovoValor('');
  };

  // Função para remover itens do orçamento
  const removerItem = (index: number) => {
    setItens(itens.filter((_, i) => i !== index));
  };

  // 2. Lógica principal de avanço de etapas no fluxo da oficina[cite: 14]
  const handleAvancarEtapa = async () => {
    // A. Transition Guard: Bloqueia transições se o ID estiver ausente
    if (!os.id) {
      alert('Erro Crítico: Esta Ordem de Serviço não tem ID registado.');
      return;
    }

    // B. O "Boss Final": Faturamento e Baixa Atômica de Estoque[cite: 14]
    // Apenas dispara na transição de EXECUCAO para CONCLUIDO
    if (os.status === 'EXECUCAO_TRABALHO' && nextStatus === 'CONCLUIDO') {
      // Usa o 'os.id' verdadeiro da tabela
      // O ID '1' da peça continua fixo (verifique se existe uma peça ID '1' no banco)
      const res = await faturarOrdemServicoAction(os.id, '1', 1);

      if (res.success) {
        console.log(res.message);
        window.location.reload(); // Recarrega a tela após sucesso
      } else {
        alert('FALHA NA TRANSAÇÃO ACID: ' + res.message);
      }
      return; // Interrompe a função aqui para não executar o update normal
    }

    // C. Fluxo Normal: Avanço entre as etapas iniciais[cite: 14]
    const updateData: any = { status: nextStatus };

    // Adiciona os dados específicos de cada etapa no payload
    if (os.status === 'ABERTURA_DIAGNOSTICO') {
      updateData.diagnosticoMecanico = diagnostico;
    }
    if (os.status === 'AGUARDANDO_APROVACAO') {
      updateData.itensOrcamento = itens;
    }

    // Chama a Server Action do componente pai (via prop) enviando o ID real e os dados
    onUpdate(os.id, updateData);
  };

  // Utilitário para formatar a exibição textual do Status
  const formatStatus = (s: string) => s.replace(/_/g, ' ');

  return (
    <Card
      className="w-full shadow-lg"
      style={{ backgroundColor: '#182127', borderColor: '#29343B', borderLeft: '4px solid #0B5D7A' }}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-base font-bold" style={{ color: '#F5F7F8' }}>
          {os.veiculo}
        </CardTitle>
        <div className="flex gap-2">
          <Badge variant="secondary" style={{ backgroundColor: '#0B5D7A', color: '#FFF' }}>
            {os.cliente}
          </Badge>
          <Badge
            variant={os.prioridade === 'ALTA' ? 'destructive' : 'outline'}
            style={{ borderColor: '#29343B', color: '#F5F7F8' }}
          >
            {os.prioridade}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        <p className="text-sm" style={{ color: '#A7B0B7' }}>
          <strong style={{ color: '#F5F7F8' }}>Problema Relatado:</strong> {os.problemaRelatado}
        </p>

        {/* Formulários dinâmicos que aparecem dependendo do status atual da FSM[cite: 14] */}

        {/* Etapa 1: Abertura */}
        {os.status === 'ABERTURA_DIAGNOSTICO' && (
          <Input
            placeholder="Digite o diagnóstico técnico..."
            value={diagnostico}
            onChange={(e) => setDiagnostico(e.target.value)}
            style={{ backgroundColor: '#0F1418', borderColor: '#29343B', color: '#F5F7F8' }}
          />
        )}

        {/* Exibe o Diagnóstico gravado nas etapas seguintes */}
        {os.status !== 'ABERTURA_DIAGNOSTICO' && os.diagnosticoMecanico && (
          <p className="text-sm" style={{ color: '#F5F7F8' }}>
            <strong style={{ color: '#18A9E0' }}>Diagnóstico Real:</strong> {os.diagnosticoMecanico}
          </p>
        )}

        {/* Etapa 2: Composição do Orçamento */}
        {os.status === 'AGUARDANDO_APROVACAO' && (
          <div
            className="space-y-3 p-3 rounded-md border"
            style={{ backgroundColor: '#0F1418', borderColor: '#29343B' }}
          >
            <p className="text-xs font-bold uppercase" style={{ color: '#18A9E0' }}>
              Composição do Orçamento
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Peça ou Serviço"
                value={novaDescricao}
                onChange={(e) => setNovaDescricao(e.target.value)}
                style={{ backgroundColor: '#182127', borderColor: '#29343B', color: '#F5F7F8' }}
              />
              <Input
                type="number"
                placeholder="R$ Valor"
                className="w-32"
                value={novoValor}
                onChange={(e) => setNovoValor(e.target.value)}
                style={{ backgroundColor: '#182127', borderColor: '#29343B', color: '#F5F7F8' }}
              />
              <Button type="button" onClick={adicionarItem} style={{ backgroundColor: '#0B5D7A', color: '#FFF' }}>
                +
              </Button>
            </div>
            {itens.length > 0 && (
              <ul
                className="space-y-1 text-sm p-2 rounded border"
                style={{ backgroundColor: '#182127', borderColor: '#29343B' }}
              >
                {itens.map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center border-b pb-1 last:border-none"
                    style={{ borderColor: '#29343B' }}
                  >
                    <span style={{ color: '#F5F7F8' }}>
                      {item.descricao} - R$ {item.valor.toFixed(2)}
                    </span>
                    <button
                      onClick={() => removerItem(index)}
                      className="text-red-400 text-xs font-bold hover:underline"
                    >
                      Remover
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* ---------------- TRILHA DE AUDITORIA VISUAL (Audit Log)[cite: 14] ---------------- */}
        {os.historico && os.historico.length > 0 && (
          <div className="mt-6 pt-4 border-t" style={{ borderColor: '#29343B' }}>
            <p className="text-xs font-bold uppercase mb-4" style={{ color: '#18A9E0' }}>
              Trilha de Auditoria
            </p>
            <div className="space-y-4 relative border-l-2 ml-3" style={{ borderColor: '#29343B' }}>
              {os.historico.map((log) => (
                <div key={log.id} className="pl-4 relative">
                  <div
                    className="absolute w-3 h-3 rounded-full -left-[7px] top-1"
                    style={{ backgroundColor: '#0B5D7A' }}
                  />
                  <p className="text-xs font-bold" style={{ color: '#F5F7F8' }}>
                    {formatStatus(log.novo_estado)}
                  </p>
                  <p className="text-[10px]" style={{ color: '#A7B0B7' }}>
                    {new Date(log.timestamp).toLocaleString('pt-BR')} - Responsável: {log.autor_id}
                  </p>
                  {log.justificativa && (
                    <p className="text-xs mt-1 italic" style={{ color: '#A7B0B7' }}>
                      "{log.justificativa}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t mt-4" style={{ borderColor: '#29343B' }}>
          <span className="text-xs font-bold uppercase" style={{ color: '#18A9E0' }}>
            {formatStatus(os.status)}
          </span>

          <div className="flex gap-2">
            {/* O botão Avançar Etapa desaparece se estiver na última etapa (ENTREGUE)[cite: 14] */}
            {nextStatus && (
              <Button
                size="sm"
                onClick={handleAvancarEtapa}
                style={{ backgroundColor: '#18A9E0', color: '#FFF' }}
                className="hover:opacity-90"
              >
                Avançar: {formatStatus(nextStatus)}
              </Button>
            )}

            <Button
              size="sm"
              variant="ghost"
              className="text-red-400 hover:text-red-300 hover:bg-transparent"
              onClick={() => onDelete(os.id)}
            >
              Excluir
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
