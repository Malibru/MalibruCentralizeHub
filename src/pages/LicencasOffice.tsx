import { useEffect, useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { CrudPage } from '../components/crud/CrudPage';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Eye, EyeOff } from 'lucide-react';

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

const RenderForm = ({ formData, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
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

      {/* SENHA */}
      <div className="space-y-2">
        <Label>Senha</Label>
        <div className="flex gap-2">
          <Input
            type={showPassword ? 'text' : 'password'}
            value={formData.senha || ''}
            onChange={(e) => onChange('senha', e.target.value)}
            placeholder="••••••••"
          />
          <button
            type="button"
            className="px-3 border rounded"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
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
};

const getNewItem = () => ({
  nome: '',
  email: '',
  senha: '', 
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
  try {
    await cadastrarLicenca(item);
    await carregarLicencas();
    alert('Licença cadastrada com sucesso');
  } catch (e) {
    alert(e.message);
    console.error(e);
  }
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
        renderForm={(formData, onChange) => (
          <RenderForm formData={formData} onChange={onChange} />
            )}
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
