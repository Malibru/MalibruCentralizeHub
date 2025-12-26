import { MainLayout } from '../components/layout/MainLayout';
import { CrudPage } from '../components/crud/CrudPage';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';

const columns = [
  { key: 'numero', label: 'Número' },
  { key: 'titulo', label: 'Título' },
  { key: 'solicitante', label: 'Solicitante' },
  { key: 'data', label: 'Data' },
  { 
    key: 'prioridade', 
    label: 'Prioridade',
    render: (value) => {
      const colors = {
        'Alta': 'destructive',
        'Média': 'warning',
        'Baixa': 'secondary'
      };
      return <Badge variant={colors[value] || 'secondary'}>{value}</Badge>;
    }
  },
  { 
    key: 'status', 
    label: 'Status',
    render: (value) => {
      const colors = {
        'Aberto': 'default',
        'Em andamento': 'warning',
        'Resolvido': 'secondary',
        'Fechado': 'secondary'
      };
      return <Badge variant={colors[value] || 'secondary'}>{value}</Badge>;
    }
  },
];

const initialData = [
  { id: '1', numero: 'RCN-001', titulo: 'Falha no servidor de backup', solicitante: 'João Silva', data: '2024-12-20', prioridade: 'Alta', status: 'Aberto', descricao: 'Servidor não está realizando backups automáticos' },
  { id: '2', numero: 'RCN-002', titulo: 'Lentidão na rede', solicitante: 'Maria Santos', data: '2024-12-19', prioridade: 'Média', status: 'Em andamento', descricao: 'Rede lenta no setor financeiro' },
  { id: '3', numero: 'RCN-003', titulo: 'Atualização de firmware', solicitante: 'Carlos Oliveira', data: '2024-12-18', prioridade: 'Baixa', status: 'Resolvido', descricao: 'Firmware do switch precisa ser atualizado' },
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
          placeholder="RCN-XXX"
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
    <div className="space-y-2">
      <Label htmlFor="solicitante">Solicitante</Label>
      <Input
        id="solicitante"
        value={formData.solicitante || ''}
        onChange={(e) => onChange('solicitante', e.target.value)}
        placeholder="Nome do solicitante"
      />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="prioridade">Prioridade</Label>
        <Input
          id="prioridade"
          value={formData.prioridade || ''}
          onChange={(e) => onChange('prioridade', e.target.value)}
          placeholder="Alta, Média ou Baixa"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Input
          id="status"
          value={formData.status || ''}
          onChange={(e) => onChange('status', e.target.value)}
          placeholder="Aberto, Em andamento, Resolvido"
        />
      </div>
    </div>
    <div className="space-y-2">
      <Label htmlFor="descricao">Descrição</Label>
      <Textarea
        id="descricao"
        value={formData.descricao || ''}
        onChange={(e) => onChange('descricao', e.target.value)}
        placeholder="Descreva o problema..."
        className="min-h-[100px]"
      />
    </div>
  </div>
);

const getNewItem = () => ({
  numero: `RCN-${String(Date.now()).slice(-3)}`,
  titulo: '',
  solicitante: '',
  data: new Date().toISOString().split('T')[0],
  prioridade: 'Média',
  status: 'Aberto',
  descricao: ''
});

export default function ChamadosRCN() {
  return (
    <MainLayout>
      <CrudPage
        title="Chamados RCN"
        columns={columns}
        initialData={initialData}
        renderForm={renderForm}
        getNewItem={getNewItem}
      />
    </MainLayout>
  );
}
