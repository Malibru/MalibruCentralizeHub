import { useState } from 'react';
import { Button } from '../ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';

export function CrudPage({
  title,
  columns,
  data = [],
  loading = false,
  renderForm,
  getNewItem,
  onCreate,
  onUpdate,
  onDelete,
  pagination,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  function openNew() {
    setEditingItem(getNewItem ? getNewItem() : {});
    setIsOpen(true);
  }

  function openEdit(item) {
    setEditingItem({ ...item });
    setIsOpen(true);
  }

  function closeDialog() {
    setIsOpen(false);
    setEditingItem(null);
  }

  async function handleSave() {
    if (!editingItem) return;

    if (editingItem.id || editingItem.ticket || editingItem.email) {
      await onUpdate?.(editingItem);
    } else {
      await onCreate?.(editingItem);
    }

    closeDialog();
  }

  function handleChange(field, value) {
    setEditingItem((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="space-y-4">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        {onCreate && (
          <Button onClick={openNew}>Novo</Button>
        )}
      </div>

      {/* TABELA */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key}>{col.label}</TableHead>
              ))}
              {(onUpdate || onDelete) && (
                <TableHead className="text-right">Ações</TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center">
                  Nenhum registro encontrado
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, idx) => (
                <TableRow key={row.id ?? row.ticket ?? idx}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.render
                        ? col.render(row[col.key], row)
                        : row[col.key]}
                    </TableCell>
                  ))}
                  {(onUpdate || onDelete) && (
                    <TableCell className="text-right space-x-2">
                      {onUpdate && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEdit(row)}
                        >
                          Editar
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDelete(row)}
                        >
                          Excluir
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINAÇÃO */}
      {pagination && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-muted-foreground">
            Página {pagination.page + 1} de {pagination.totalPages}
          </span>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === 0}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
            >
              Anterior
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page + 1 >= pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}

      {/* MODAL */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem?.id || editingItem?.ticket || editingItem?.email ? 'Editar' : 'Novo'}
            </DialogTitle>
          </DialogHeader>

          {editingItem && renderForm(editingItem, handleChange)}

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
