import { MainLayout } from '../components/layout/MainLayout';
import { CrudPage } from '../components/crud/CrudPage';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';

const columns = [
  { key: 'patrimonio', label: 'Patrimônio' },
  { key: 'tipo', label: 'Tipo' },
  { key: 'modelo', label: 'Modelo' },
  { key: 'usuario', label: 'Usuário' },
  { 
    key: 'status', 
    label: 'Status',
    render: (value) => (
      <Badge variant={value === 'Em uso' ? 'default' : value === 'Disponível' ? 'secondary' : 'destructive'}>
        {value}
      </Badge>
    )
  },
];

const initialData = [
  { id: '1', patrimonio: 'NB-001', tipo: 'Notebook', modelo: 'Dell Latitude 5520', usuario: 'João Silva', status: 'Em uso' },
  { id: '2', patrimonio: 'DT-015', tipo: 'Desktop', modelo: 'HP ProDesk 400', usuario: '-', status: 'Disponível' },
  { id: '3', patrimonio: 'MN-008', tipo: 'Monitor', modelo: 'LG 24"', usuario: 'Maria Santos', status: 'Em uso' },
  { id: '4', patrimonio: 'NB-022', tipo: 'Notebook', modelo: 'Lenovo ThinkPad', usuario: '-', status: 'Manutenção' },
];

const renderForm = (formData, onChange) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="patrimonio">Patrimônio</Label>
      <Input
        id="patrimonio"
        value={formData.patrimonio || ''}
        onChange={(e) => onChange('patrimonio', e.target.value)}
        placeholder="Código do patrimônio"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="tipo">Tipo</Label>
      <Input
        id="tipo"
        value={formData.tipo || ''}
        onChange={(e) => onChange('tipo', e.target.value)}
        placeholder="Tipo do equipamento"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="modelo">Modelo</Label>
      <Input
        id="modelo"
        value={formData.modelo || ''}
        onChange={(e) => onChange('modelo', e.target.value)}
        placeholder="Modelo do equipamento"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="usuario">Usuário</Label>
      <Input
        id="usuario"
        value={formData.usuario || ''}
        onChange={(e) => onChange('usuario', e.target.value)}
        placeholder="Usuário responsável"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="status">Status</Label>
      <Input
        id="status"
        value={formData.status || ''}
        onChange={(e) => onChange('status', e.target.value)}
        placeholder="Em uso, Disponível ou Manutenção"
      />
    </div>
  </div>
);

const getNewItem = () => ({
  patrimonio: '',
  tipo: '',
  modelo: '',
  usuario: '',
  status: 'Disponível'
});

export default function Equipamentos() {
  return (
    <MainLayout>
      <CrudPage
        title="Equipamentos"
        columns={columns}
        initialData={initialData}
        renderForm={renderForm}
        getNewItem={getNewItem}
      />
    </MainLayout>
  );
}
