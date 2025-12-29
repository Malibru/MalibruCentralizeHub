import { useEffect, useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { CrudPage } from '../components/crud/CrudPage';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';

import {
  listarUsuariosPaginado,
  cadastrarUsuario,
  atualizarUsuario,
  deletarUsuario,
} from '../services/UsuariosServices';

/* =======================
   COLUNAS
======================= */
const columns = [
  { key: 'nome', label: 'Nome' },
  { key: 'email', label: 'E-mail' },
  {
    key: 'login',
    label: 'Login',
  },
  {
    key: 'departamento',
    label: 'Departamento',
    render: (_, row) => row.departamento?.nome || '',
  },
  {
    key: 'role',
    label: 'Perfil',
    render: (value) => (
      <Badge variant={value === 'ADMIN' ? 'destructive' : 'default'}>
        {value}
      </Badge>
    ),
  },
];

/* =======================
   FORMULÁRIO
======================= */
const renderForm = (formData, onChange) => (
  <div className="space-y-4">
    <div>
      <Label>Nome</Label>
      <Input
        value={formData.nome || ''}
        onChange={(e) => onChange('nome', e.target.value)}
      />
    </div>

    <div>
      <Label>Email</Label>
      <Input
        type="email"
        value={formData.email || ''}
        onChange={(e) => onChange('email', e.target.value)}
      />
    </div>

    <div>
      <Label>Login</Label>
      <Input
        value={formData.login || ''}
        onChange={(e) => onChange('login', e.target.value)}
      />
    </div>

    <div>
      <Label>Senha</Label>
      <Input
        type="password"
        value={formData.senha || ''}
        onChange={(e) => onChange('senha', e.target.value)}
      />
    </div>

    <div>
      <Label>ID do Departamento</Label>
      <Input
        type="number"
        value={formData.departamentoId || ''}
        onChange={(e) => onChange('departamentoId', e.target.value)}
      />
    </div>

    <div>
      <Label>ID da Licença Office</Label>
      <Input
        type="number"
        value={formData.licencaOfficeId || ''}
        onChange={(e) => onChange('licencaOfficeId', e.target.value)}
      />
    </div>

    <div>
      <Label>Role</Label>
      <Input
        value={formData.role || 'USER'}
        onChange={(e) => onChange('role', e.target.value)}
        placeholder="ADMIN / USER"
      />
    </div>
  </div>
);

/* =======================
   NOVO ITEM
======================= */
const getNewItem = () => ({
  nome: '',
  email: '',
  login: '',
  senha: '',
  departamentoId: '',
  licencaOfficeId: '',
  role: 'USER',
});

/* =======================
   COMPONENTE
======================= */
export default function Usuarios() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    carregarUsuarios();
  }, [page]);

  async function carregarUsuarios() {
    try {
      setLoading(true);
      const res = await listarUsuariosPaginado(page, 10);
      setData(res.content);
      setTotalPages(res.totalPages);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function onCreate(item) {
    await cadastrarUsuario(item);
    await carregarUsuarios();
  }

  async function onUpdate(item) {
    await atualizarUsuario(item.id, item);
    await carregarUsuarios();
  }

  async function onDelete(item) {
    await deletarUsuario(item.login);
    await carregarUsuarios();
  }

  return (
    <MainLayout>
      <CrudPage
        title="Usuários"
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
