import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogTitle } from 'radix-ui/dialog';
import React, { useActionState } from 'react';
import { Controller, useForm } from 'react-hook-form';

// Importações atualizadas para os novos ficheiros do domínio
import { createOrdemServico } from '../api/ordem-servico.action';
import { OrdemServicoFormData, ordemServicoSchema } from '../schema/ordem-servico.schema';
import { InitialActionOrdemServicoState, OrdemServicoFormDialogProps } from '../type/ordem-servico.type';

export function OrdemServicoCreateDialog({ isOpen, onOpenChange }: OrdemServicoFormDialogProps) {
  const [state, formAction, isPending] = useActionState(createOrdemServico, InitialActionOrdemServicoState);

  const form = useForm<OrdemServicoFormData>({
    resolver: zodResolver(ordemServicoSchema) as any,
    defaultValues: {
      cliente: '',
      veiculo: '',
      problemaRelatado: '',
      prioridade: 'BAIXA',
    },
  });

  // Reset do formulário ao abrir
  React.useEffect(() => {
    if (isOpen) {
      form.clearErrors();
    }
    form.reset({
      cliente: '',
      veiculo: '',
      problemaRelatado: '',
      prioridade: 'BAIXA',
    });
  }, [isOpen, form]);

  // Controle de Sucesso/Erro vindo do servidor
  React.useEffect(() => {
    if (!state) return;

    if (state.success) {
      onOpenChange(false);
      console.log('Ordem de Serviço criada com sucesso!!');
    }

    if (!state.success && state.message) {
      if (state.errors) {
        Object.entries(state.errors).forEach(([field, message]) => {
          form.setError(field as keyof OrdemServicoFormData, {
            type: 'server',
            message: Array.isArray(message) ? message[0] : message,
          });
        });
      }
    }
  }, [state, onOpenChange, form]);

  const onSubmit = (formData: OrdemServicoFormData) => {
    React.startTransition(async () => {
      // Evita que a server action reclame de parâmetros ocultos
      formAction(formData as any);
    });
  };

  const isBusy = isPending || form.formState.isSubmitting;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[600px] max-h-[700px] overflow-y-auto"
        style={{ backgroundColor: '#182127', borderColor: '#29343B', color: '#F5F7F8' }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold" style={{ color: '#18A9E0' }}>
            Abertura de nova O.S.
          </DialogTitle>
        </DialogHeader>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            {/* Campo Cliente */}
            <Controller
              name="cliente"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="cliente" style={{ color: '#A7B0B7' }}>
                    Nome do Cliente
                  </FieldLabel>
                  <Input
                    {...field}
                    id="cliente"
                    value={field.value ?? ''}
                    aria-invalid={fieldState.invalid}
                    placeholder="Ex: João da Silva"
                    autoComplete="off"
                    style={{ backgroundColor: '#0F1418', borderColor: '#29343B', color: '#FFF' }}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Campo Veículo */}
            <Controller
              name="veiculo"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="veiculo" style={{ color: '#A7B0B7' }}>
                    Veículo
                  </FieldLabel>
                  <Input
                    {...field}
                    id="veiculo"
                    placeholder="Ex: Chevrolet Prisma 2009 1.4"
                    aria-invalid={fieldState.invalid}
                    style={{ backgroundColor: '#0F1418', borderColor: '#29343B', color: '#FFF' }}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Campo Problema Relatado */}
            <Controller
              name="problemaRelatado"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="problemaRelatado" style={{ color: '#A7B0B7' }}>
                    Problema Relatado
                  </FieldLabel>
                  <Input
                    {...field}
                    id="problemaRelatado"
                    placeholder="Ex: Barulho na suspensão dianteira"
                    aria-invalid={fieldState.invalid}
                    style={{ backgroundColor: '#0F1418', borderColor: '#29343B', color: '#FFF' }}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Campo Prioridade */}
            <Controller
              name="prioridade"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="prioridade" style={{ color: '#A7B0B7' }}>
                    Prioridade
                  </FieldLabel>
                  <select
                    {...field}
                    id="prioridade"
                    value={field.value ?? ''}
                    disabled={form.formState.isSubmitting}
                    aria-invalid={fieldState.invalid}
                    className="flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ backgroundColor: '#0F1418', borderColor: '#29343B', color: '#FFF' }}
                  >
                    <option value="BAIXA">Baixa (Revisão normal)</option>
                    <option value="MEDIA">Média (Barulhos/Falhas leves)</option>
                    <option value="ALTA">Alta (Carro parado/Risco de quebra)</option>
                  </select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
          <DialogFooter className="pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-[#29343B] text-[#A7B0B7] hover:bg-[#29343B] hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              style={{ backgroundColor: '#18A9E0', color: '#FFF' }}
              className="font-bold hover:opacity-90"
            >
              {isBusy ? 'Salvando...' : 'Abrir O.S.'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
