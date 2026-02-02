import { MainLayout } from '../components/layout/MainLayout';
import { CrudPage } from '../components/crud/CrudPage';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';

const columns = [
  { key: 'numero', label: 'Número' },
  { key: 'titulo', label: 'Título' },
  { key: 'categoria', label: 'Categoria' },
  { key: 'solicitante', label: 'Solicitante' },
  { key: 'data', label: 'Data' },
  { 
    key: 'status', 
    label: 'Status',
    render: (value) => {
      const colors = {
        'Aberto': 'default',
        'Em análise': 'warning',
        'Concluído': 'secondary'
      };
      return <Badge variant={colors[value] || 'secondary'}>{value}</Badge>;
    }
  },
];

const initialData = [
  { id: '1', numero: 'INT-001', titulo: 'Solicitação de novo notebook', categoria: 'Equipamento', solicitante: 'João Silva', data: '2024-12-20', status: 'Aberto', descricao: 'Necessito de um novo notebook para trabalho remoto' },
  { id: '2', numero: 'INT-002', titulo: 'Acesso ao sistema financeiro', categoria: 'Acesso', solicitante: 'Maria Santos', data: '2024-12-19', status: 'Em análise', descricao: 'Preciso de acesso ao módulo de relatórios' },
  { id: '3', numero: 'INT-003', titulo: 'Instalação de software', categoria: 'Software', solicitante: 'Carlos Oliveira', data: '2024-12-18', status: 'Concluído', descricao: 'Instalação do Adobe Acrobat Pro' },
];

const renderForm = (formData, onChange) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="numero">Número</Label>
        <Input
          id="numero"
          value={formData.numero || ''}
          onChange={(e) => onChange('numero', e.target.value)}
          placeholder="INT-XXX"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="data">Data</Label>
        <Input
          id="data"
          type="date"
          value={formData.data || ''}
          onChange={(e) => onChange('data', e.target.value)}
        />
      </div>
    </div>
    <div className="space-y-2">
      <Label htmlFor="titulo">Título</Label>
      <Input
        id="titulo"
        value={formData.titulo || ''}
        onChange={(e) => onChange('titulo', e.target.value)}
        placeholder="Título do chamado"
      />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="categoria">Categoria</Label>
        <Input
          id="categoria"
          value={formData.categoria || ''}
          onChange={(e) => onChange('categoria', e.target.value)}
          placeholder="Equipamento, Acesso, Software..."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="solicitante">Solicitante</Label>
        <Input
          id="solicitante"
          value={formData.solicitante || ''}
          onChange={(e) => onChange('solicitante', e.target.value)}
          placeholder="Nome do solicitante"
        />
      </div>
    </div>
    <div className="space-y-2">
      <Label htmlFor="status">Status</Label>
      <Input
        id="status"
        value={formData.status || ''}
        onChange={(e) => onChange('status', e.target.value)}
        placeholder="Aberto, Em análise, Concluído"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="descricao">Descrição</Label>
      <Textarea
        id="descricao"
        value={formData.descricao || ''}
        onChange={(e) => onChange('descricao', e.target.value)}
        placeholder="Descreva a solicitação..."
        className="min-h-[100px]"
      />
    </div>
  </div>
);

const getNewItem = () => ({
  numero: `INT-${String(Date.now()).slice(-3)}`,
  titulo: '',
  categoria: '',
  solicitante: '',
  data: new Date().toISOString().split('T')[0],
  status: 'Aberto',
  descricao: ''
});

export default function ChamadosInternos() {
  return (
    <MainLayout>
      <CrudPage
        title="Chamados Internos"
        columns={columns}
        initialData={initialData}
        renderForm={renderForm}
        getNewItem={getNewItem}
      />
    </MainLayout>
  );
}
