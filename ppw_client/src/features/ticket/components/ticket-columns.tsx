import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { PencilIcon, Trash2 } from 'lucide-react';
import { Ticket } from '../type/ticket.type';

interface TicketColumnsProps {
  onEdit: (ticket: Ticket) => void;
  onDelete: (id?: string) => void;
}

// Função auxiliar para formatar o Enum de status sem os underlines
const formatStatus = (status: string) => {
  if (!status) return '';
  return status.replace(/_/g, ' ');
};

export const getTicketColumns = ({ onEdit, onDelete }: TicketColumnsProps): ColumnDef<Ticket>[] => [
  {
    accessorKey: 'id',
    header: () => <span className="hidden sm:inline-block">Cód.</span>,
    cell: ({ row }) => {
      // Exibe apenas os primeiros 6 caracteres do UUID para não poluir a tabela
      const shortId = row.original.id ? row.original.id.substring(0, 6).toUpperCase() : '-';
      return <span className="hidden sm:inline-block font-mono text-xs text-[#A7B0B7]">{shortId}</span>;
    },
  },
  {
    accessorKey: 'cliente',
    header: 'Cliente',
    cell: ({ row }) => (
      <span className="font-bold max-w-[120px] truncate sm:max-w-none block text-[#F5F7F8]">
        {row.original.cliente}
      </span>
    ),
  },
  {
    accessorKey: 'veiculo',
    header: 'Veículo',
    cell: ({ row }) => <span className="font-medium truncate text-[#18A9E0]">{row.original.veiculo}</span>,
  },
  {
    accessorKey: 'problemaRelatado',
    header: () => <span className="hidden md:inline-block">Problema Relatado</span>,
    cell: ({ row }) => (
      <span className="hidden md:inline-block max-w-[200px] truncate text-[#A7B0B7]">
        {row.original.problemaRelatado}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status || '';

      // Cores dinâmicas para o fluxo da oficina
      let colorClass = 'bg-[#182127] text-[#A7B0B7] border-[#29343B]';
      if (status === 'ABERTURA_DIAGNOSTICO') colorClass = 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      if (status === 'APROVACAO_ORCAMENTO') colorClass = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      if (status === 'EXECUCAO_TRABALHO') colorClass = 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      if (status === 'ENTREGA_CARRO') colorClass = 'bg-green-500/10 text-green-400 border-green-500/20';

      return (
        <Badge variant="outline" className={`text-[10px] sm:text-xs border ${colorClass}`}>
          {formatStatus(status)}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    header: () => <span className="block text-right">Ações</span>,
    cell: ({ row }) => {
      const ticket = row.original;
      return (
        <div className="text-right space-x-1 sm:space-x-2 whitespace-nowrap">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit(ticket)}
            className="border-[#29343B] bg-transparent text-[#F5F7F8] hover:bg-[#0B5D7A] hover:text-white"
          >
            <PencilIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
            onClick={() => onDelete(ticket.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      );
    },
  },
];
