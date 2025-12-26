import { MainLayout } from '../components/layout/MainLayout';
import { CrudPage } from '../components/crud/CrudPage';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';

const columns = [
  { key: 'email', label: 'E-mail' },
  { key: 'produto', label: 'Produto' },
  { key: 'usuario', label: 'Usuário' },
  { key: 'validade', label: 'Validade' },
  { 
    key: 'status', 
    label: 'Status',
    render: (value) => (
      <Badge variant={value === 'Ativa' ? 'default' : 'destructive'}>
        {value}
      </Badge>
    )
  },
];

const initialData = [
  { id: '1', email: 'joao@malibru.com', produto: 'Microsoft 365 Business', usuario: 'João Silva', validade: '2025-12-31', status: 'Ativa' },
  { id: '2', email: 'maria@malibru.com', produto: 'Microsoft 365 Business', usuario: 'Maria Santos', validade: '2025-12-31', status: 'Ativa' },
  { id: '3', email: 'carlos@malibru.com', produto: 'Microsoft 365 Enterprise', usuario: 'Carlos Oliveira', validade: '2024-06-30', status: 'Expirada' },
];

const renderForm = (formData, onChange) => (
  <div className="space-y-4">
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
      <Label htmlFor="produto">Produto</Label>
      <Input
        id="produto"
        value={formData.produto || ''}
        onChange={(e) => onChange('produto', e.target.value)}
        placeholder="Microsoft 365 Business"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="usuario">Usuário</Label>
      <Input
        id="usuario"
        value={formData.usuario || ''}
        onChange={(e) => onChange('usuario', e.target.value)}
        placeholder="Nome do usuário"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="validade">Validade</Label>
      <Input
        id="validade"
        type="date"
        value={formData.validade || ''}
        onChange={(e) => onChange('validade', e.target.value)}
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="status">Status</Label>
      <Input
        id="status"
        value={formData.status || ''}
        onChange={(e) => onChange('status', e.target.value)}
        placeholder="Ativa ou Expirada"
      />
    </div>
  </div>
);

const getNewItem = () => ({
  email: '',
  produto: '',
  usuario: '',
  validade: '',
  status: 'Ativa'
});

export default function LicencasOffice() {
  return (
    <MainLayout>
      <CrudPage
        title="Licenças Office"
        columns={columns}
        initialData={initialData}
        renderForm={renderForm}
        getNewItem={getNewItem}
      />
    </MainLayout>
  );
}
