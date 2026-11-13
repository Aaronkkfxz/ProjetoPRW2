'use client';

import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo, useState } from 'react';

import { OrdemServico } from '../type/ordem-servico.type';
import { getOrdemServicoColumns } from './ordem-servico-columns';
import { OrdemServicoCreateDialog } from './OrdemServicoCreateDialog';
import { OrdemServicoCard } from '@/components/cards/OrdemServicoCard';
// O seu Card da Máquina de Estados

export interface OrdemServicoProps {
  ordensServico: OrdemServico[];
}

export default function OrdensServicoPage({ ordensServico }: OrdemServicoProps) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Estados para controlar o painel de edição do lápis
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [osSelecionada, setOsSelecionada] = useState<OrdemServico | null>(null);

  const handleOpenCreate = () => {
    setIsFormOpen(true);
  };

  // Agora o botão do lápis injeta a O.S. e abre o modal
  const handleOpenUpdate = (os: OrdemServico) => {
    setOsSelecionada(os);
    setIsEditOpen(true);
  };

  const handleOpenDelete = (id?: string) => {
    console.log('Deletar OS:', id);
  };

  const columns = useMemo<ColumnDef<OrdemServico>[]>(
    () => getOrdemServicoColumns({ onEdit: handleOpenUpdate, onDelete: handleOpenDelete }),
    [],
  );

  const table = useReactTable({
    data: ordensServico ?? [],
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: { pageSize: 5 },
    },
  });

  return (
    <div
      className="space-y-6"
      style={{ backgroundColor: '#0F1418', color: '#F5F7F8', minHeight: '100vh', padding: '2rem' }}
    >
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: '#18A9E0' }}>
          Ordens de Serviço
        </h1>
        <p style={{ color: '#A7B0B7' }}>Gestão de veículos na oficina</p>
      </div>

      <div className="">
        <Alert style={{ backgroundColor: '#182127', borderColor: '#29343B', color: '#F5F7F8' }}></Alert>
      </div>

      <div className="flex justify-between items-center">
        <Button
          onClick={handleOpenCreate}
          style={{ backgroundColor: '#18A9E0', color: '#FFF' }}
          className="hover:opacity-90 font-bold"
        >
          + Nova Ordem de Serviço
        </Button>
      </div>

      <div
        className="border rounded-xl w-full overflow-x-auto shadow-lg"
        style={{ borderColor: '#29343B', backgroundColor: '#182127' }}
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headers) => (
              <TableRow key={headers.id} style={{ borderColor: '#29343B', backgroundColor: '#0B5D7A' }}>
                {headers.headers.map((header) => (
                  <TableHead key={header.id} style={{ color: '#F5F7F8', fontWeight: 'bold' }}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getCoreRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  style={{ borderColor: '#29343B', color: '#F5F7F8' }}
                  className="hover:bg-[#0F1418]/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8" style={{ color: '#A7B0B7' }}>
                  Nenhum veículo na oficina no momento
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <OrdemServicoCreateDialog isOpen={isFormOpen} onOpenChange={setIsFormOpen} />

      {/* O Modal Oculto que o lápis vai disparar */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-[700px] p-0 border-none bg-transparent shadow-none">
          <DialogTitle className="hidden">Editar Ordem de Serviço</DialogTitle>
          {osSelecionada && (
            <OrdemServicoCard
              os={osSelecionada}
              onUpdate={(id, updateData) => {
                window.location.reload();
              }}
              onDelete={(id) => {
                console.log('Deletar OS:', id);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
