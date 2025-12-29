import { useEffect, useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { CrudPage } from '../components/crud/CrudPage';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';

import {
  listarLicencasPaginado,
  cadastrarLicenca,
  atualizarLicenca,
  deletarLicenca,
} from '../services/LicencasOfficesServices';

/* =======================
   COLUNAS
======================= */
const columns = [
  { key: 'nome', label: 'Nome' },
  { key: 'email', label: 'E-mail' },
  {
    key: 'dataVencimento',
    label: 'Vencimento',
  },
  {
    key: 'status',
    label: 'Status',
    render: (_, row) => {
      const hoje = new Date();
      const venc = new Date(row.dataVencimento.split('-').reverse().join('-'));
      const ativo = venc >= hoje;

      return (
        <Badge variant={ativo ? 'default' : 'destructive'}>
          {ativo ? 'Ativa' : 'Expirada'}
        </Badge>
      );
    },
  },
];

const renderForm = (formData, onChange) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label>Nome</Label>
      <Input
        value={formData.nome || ''}
        onChange={(e) => onChange('nome', e.target.value)}
      />
    </div>

    <div className="space-y-2">
      <Label>E-mail</Label>
      <Input
        type="email"
        value={formData.email || ''}
        onChange={(e) => onChange('email', e.target.value)}
      />
    </div>

    <div className="space-y-2">
      <Label>Data de Vencimento</Label>
      <Input
        type="date"
        value={formData.dataVencimento || ''}
        onChange={(e) => onChange('dataVencimento', e.target.value)}
      />
    </div>
  </div>
);

const getNewItem = () => ({
  nome: '',
  email: '',
  senha: '123456', // backend exige
  dataVencimento: '',
});

export default function LicencasOffice() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    carregarLicencas();
  }, [page]);

  async function carregarLicencas() {
    try {
      setLoading(true);
      const res = await listarLicencasPaginado(page, 10);
      setData(res.content);
      setTotalPages(res.totalPages);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function onCreate(item) {
    await cadastrarLicenca(item);
    await carregarLicencas();
  }

  async function onUpdate(item) {
    await atualizarLicenca(item.email, item);
    await carregarLicencas();
  }

  async function onDelete(item) {
    await deletarLicenca(item.email);
    await carregarLicencas();
  }

  return (
    <MainLayout>
      <CrudPage
        title="Licenças Office"
        columns={columns}
        data={data}
        loading={loading}
        renderForm={renderForm}
        getNewItem={getNewItem}
        onCreate={onCreate}
        onUpdate={onUpdate}
        onDelete={onDelete}
        pagination={{
          page,
          totalPages,
          onPageChange: setPage,
        }}
      />
    </MainLayout>
  );
}
