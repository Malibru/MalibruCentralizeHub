import { useEffect, useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { CrudPage } from '../components/crud/CrudPage';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';

import {
  listarChamadosPaginado,
  cadastrarChamado,
  atualizarChamado,
  deletarChamado,
} from '../services/ChamadosRcnServices';

/* ================= COLUNAS ================= */
const columns = [
  { key: 'ticket', label: 'Ticket' },
  { key: 'responsavel', label: 'Responsável' },
  { key: 'dataAbertura', label: 'Abertura' },
  { key: 'dataFechamento', label: 'Fechamento' },
  {
    key: 'status',
    label: 'Status',
    render: (value) => {
      const variants = {
        ABERTO: 'default',
        EM_ANALISE: 'warning',
        CONCLUIDO: 'secondary',
      };
      return <Badge variant={variants[value] || 'secondary'}>{value}</Badge>;
    },
  },
];

/* ================= FORMULÁRIO ================= */
const renderForm = (formData, onChange) => (
  <div className="space-y-4">

    <div className="space-y-2">
      <Label>Responsável</Label>
      <Input
        value={formData.responsavel || ''}
        onChange={(e) => onChange('responsavel', e.target.value)}
        placeholder="Nome do responsável"
      />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Data de Abertura</Label>
        <Input
          type="date"
          value={formData.dataAbertura || ''}
          onChange={(e) => onChange('dataAbertura', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Data de Fechamento</Label>
        <Input
          type="date"
          value={formData.dataFechamento || ''}
          onChange={(e) => onChange('dataFechamento', e.target.value)}
        />
      </div>
    </div>

    <div className="space-y-2">
      <Label>Status</Label>
      <Input
        value={formData.status || ''}
        onChange={(e) => onChange('status', e.target.value)}
        placeholder="ABERTO | EM_ANALISE | CONCLUIDO"
      />
    </div>

  </div>
);

/* ================= NOVO ITEM ================= */
const getNewItem = () => ({
  ticket: `RCN-${Date.now()}`,
  responsavel: '',
  dataAbertura: new Date().toISOString().split('T')[0],
  dataFechamento: '',
  status: 'ABERTO',
});

/* ================= COMPONENTE ================= */
export default function ChamadosRcn() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    carregarChamados();
  }, [page]);

  async function carregarChamados() {
    try {
      setLoading(true);
      const response = await listarChamadosPaginado(page, 10);
      setData(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Erro ao carregar chamados:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <MainLayout>
      <CrudPage
        title="Chamados RCN"
        columns={columns}
        data={data}
        loading={loading}
        renderForm={renderForm}
        getNewItem={getNewItem}
        onCreate={cadastrarChamado}
        onUpdate={(item) => atualizarChamado(item.ticket, item)}
        onDelete={(item) => deletarChamado(item.ticket)}
        pagination={{
          page,
          totalPages,
          onPageChange: setPage,
        }}
      />
    </MainLayout>
  );
}
