import { useEffect, useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { CrudPage } from '../components/crud/CrudPage';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';

import {
  listarEquipamentosPaginado,
  cadastrarEquipamento,
  atualizarEquipamento,
  deletarEquipamento,
} from '../services/EquipamentosServices';

/* =======================
   COLUNAS
======================= */
const columns = [
  { key: 'nome', label: 'Nome' },
  { key: 'numeroSerie', label: 'Nº Série' },
  { key: 'descricao', label: 'Descrição' },
  { key: 'quantidade', label: 'Quantidade' },
  {
    key: 'disponivel',
    label: 'Disponível',
    render: (value) => (
      <Badge variant={value ? 'default' : 'destructive'}>
        {value ? 'Sim' : 'Não'}
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
      <Label>Número de Série</Label>
      <Input
        value={formData.numeroSerie || ''}
        onChange={(e) => onChange('numeroSerie', e.target.value)}
      />
    </div>

    <div>
      <Label>Descrição</Label>
      <Input
        value={formData.descricao || ''}
        onChange={(e) => onChange('descricao', e.target.value)}
      />
    </div>

    <div>
      <Label>Quantidade</Label>
      <Input
        type="number"
        value={formData.quantidade || ''}
        onChange={(e) => onChange('quantidade', e.target.value)}
      />
    </div>

    <div>
      <Label>Disponível</Label>
      <select
        className="w-full border rounded px-2 py-1"
        value={formData.disponivel ?? true}
        onChange={(e) => onChange('disponivel', e.target.value === 'true')}
      >
        <option value="true">Sim</option>
        <option value="false">Não</option>
      </select>
    </div>
  </div>
);

/* =======================
   NOVO ITEM
======================= */
const getNewItem = () => ({
  nome: '',
  descricao: '',
  quantidade: 1,
  numeroSerie: '',
  disponivel: true,
});

/* =======================
   COMPONENTE
======================= */
export default function Equipamentos() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    carregarEquipamentos();
  }, [page]);

  async function carregarEquipamentos() {
    try {
      setLoading(true);
      const res = await listarEquipamentosPaginado(page, 10);
      setData(res.content);
      setTotalPages(res.totalPages);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function onCreate(item) {
    await cadastrarEquipamento(item);
    await carregarEquipamentos();
  }

  async function onUpdate(item) {
    await atualizarEquipamento(item.nome, item);
    await carregarEquipamentos();
  }

  async function onDelete(item) {
    await deletarEquipamento(item.nome);
    await carregarEquipamentos();
  }

  return (
    <MainLayout>
      <CrudPage
        title="Equipamentos"
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
