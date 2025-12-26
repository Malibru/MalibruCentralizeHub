import { MainLayout } from '../components/layout/MainLayout';
import { CrudPage } from '../components/crud/CrudPage';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';

const columns = [
  { key: 'nome', label: 'Nome' },
  { key: 'email', label: 'E-mail' },
  { key: 'departamento', label: 'Departamento' },
  { key: 'cargo', label: 'Cargo' },
  { 
    key: 'status', 
    label: 'Status',
    render: (value) => (
      <Badge variant={value === 'Ativo' ? 'default' : 'secondary'}>
        {value}
      </Badge>
    )
  },
];

const initialData = [
  { id: '1', nome: 'João Silva', email: 'joao@malibru.com', departamento: 'TI', cargo: 'Analista de Sistemas', status: 'Ativo' },
  { id: '2', nome: 'Maria Santos', email: 'maria@malibru.com', departamento: 'RH', cargo: 'Analista de RH', status: 'Ativo' },
  { id: '3', nome: 'Carlos Oliveira', email: 'carlos@malibru.com', departamento: 'Financeiro', cargo: 'Contador', status: 'Inativo' },
  { id: '4', nome: 'Ana Costa', email: 'ana@malibru.com', departamento: 'TI', cargo: 'Desenvolvedora', status: 'Ativo' },
];

const renderForm = (formData, onChange) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="nome">Nome</Label>
      <Input
        id="nome"
        value={formData.nome || ''}
        onChange={(e) => onChange('nome', e.target.value)}
        placeholder="Nome completo"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="email">E-mail</Label>
      <Input
        id="email"
        type="email"
        value={formData.email || ''}
        onChange={(e) => onChange('email', e.target.value)}
        placeholder="email@malibru.com"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="departamento">Departamento</Label>
      <Input
        id="departamento"
        value={formData.departamento || ''}
        onChange={(e) => onChange('departamento', e.target.value)}
        placeholder="Departamento"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="cargo">Cargo</Label>
      <Input
        id="cargo"
        value={formData.cargo || ''}
        onChange={(e) => onChange('cargo', e.target.value)}
        placeholder="Cargo"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="status">Status</Label>
      <Input
        id="status"
        value={formData.status || ''}
        onChange={(e) => onChange('status', e.target.value)}
        placeholder="Ativo ou Inativo"
      />
    </div>
  </div>
);

const getNewItem = () => ({
  nome: '',
  email: '',
  departamento: '',
  cargo: '',
  status: 'Ativo'
});

export default function Usuarios() {
  return (
    <MainLayout>
      <CrudPage
        title="Usuários"
        columns={columns}
        initialData={initialData}
        renderForm={renderForm}
        getNewItem={getNewItem}
      />
    </MainLayout>
  );
}
