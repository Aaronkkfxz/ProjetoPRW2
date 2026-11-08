import { useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { OrdemServico } from '@/features/ordem-servico/type/ordem-servico.type';

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

  // 1. Atualizado com a Máquina de Estados Finita da Oficina
  const order = [
    'ABERTURA_DIAGNOSTICO',
    'AGUARDANDO_APROVACAO',
    'AGUARDANDO_PECAS',
    'EXECUCAO_TRABALHO',
    'CONCLUIDO',
    'ENTREGUE',
  ];

  const currentIndex = order.indexOf(os.status);
  const nextStatus = currentIndex < order.length - 1 ? order[currentIndex + 1] : null;

  const adicionarItem = () => {
    if (!novaDescricao || !novoValor) return;
    const valorNum = parseFloat(novoValor);
    if (isNaN(valorNum)) return;
    setItens([...itens, { descricao: novaDescricao, valor: valorNum }]);
    setNovaDescricao('');
    setNovoValor('');
  };

  const removerItem = (index: number) => {
    setItens(itens.filter((_, i) => i !== index));
  };

  const handleAvancarEtapa = () => {
    const updateData: any = { status: nextStatus };

    // Regras de negócio acopladas aos estágios específicos da OS
    if (os.status === 'ABERTURA_DIAGNOSTICO') {
      updateData.diagnosticoMecanico = diagnostico;
    }
    if (os.status === 'AGUARDANDO_APROVACAO') {
      updateData.itensOrcamento = itens;
    }

    onUpdate(os.id, updateData);
  };

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

        {/* Inputs dinâmicos baseados no Status */}
        {os.status === 'ABERTURA_DIAGNOSTICO' && (
          <Input
            placeholder="Digite o diagnóstico técnico..."
            value={diagnostico}
            onChange={(e) => setDiagnostico(e.target.value)}
            style={{ backgroundColor: '#0F1418', borderColor: '#29343B', color: '#F5F7F8' }}
          />
        )}

        {os.status !== 'ABERTURA_DIAGNOSTICO' && os.diagnosticoMecanico && (
          <p className="text-sm" style={{ color: '#F5F7F8' }}>
            <strong style={{ color: '#18A9E0' }}>Diagnóstico Real:</strong> {os.diagnosticoMecanico}
          </p>
        )}

        {/* Campo de Itens de Orçamento */}
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

        <div className="flex items-center justify-between pt-2 border-t mt-4" style={{ borderColor: '#29343B' }}>
          <span className="text-xs font-bold uppercase" style={{ color: '#18A9E0' }}>
            {formatStatus(os.status)}
          </span>

          <div className="flex gap-2">
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
