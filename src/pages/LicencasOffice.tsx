import { useEffect, useState } from 'react';
import { parse, format } from 'date-fns';
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
    render: (_, row) => {
      try {
        const d1 = parse(row.dataVencimento, 'dd-MM-yyyy', new Date());
        if (!isNaN(d1.getTime())) return format(d1, 'dd/MM/yyyy');
      } catch {}
      try {
        const d2 = parse(row.dataVencimento, 'yyyy-MM-dd', new Date());
        if (!isNaN(d2.getTime())) return format(d2, 'dd/MM/yyyy');
      } catch {}
      try {
        const d3 = parse(row.dataVencimento, 'dd/MM/yyyy', new Date());
        if (!isNaN(d3.getTime())) return format(d3, 'dd/MM/yyyy');
      } catch {}
      return row.dataVencimento ?? '-';
    },
  },
  {
    key: 'status',
    label: 'Status',
    render: (_, row) => {
      const hoje = new Date();
      function parseVencimento(str?: string) {
        if (!str) return new Date(NaN);
        try {
          const d1 = parse(str, 'dd-MM-yyyy', new Date());
          if (!isNaN(d1.getTime())) return d1;
        } catch {}
        try {
          const d2 = parse(str, 'yyyy-MM-dd', new Date());
          if (!isNaN(d2.getTime())) return d2;
        } catch {}
        try {
          const d3 = parse(str, 'dd/MM/yyyy', new Date());
          if (!isNaN(d3.getTime())) return d3;
        } catch {}
        const d = new Date(str);
        return d;
      }
      const venc = parseVencimento(row.dataVencimento);
      const ativo = !isNaN(venc.getTime()) && venc >= hoje;

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
