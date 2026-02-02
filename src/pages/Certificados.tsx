import { useState, useMemo, useEffect } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
// Removido Badge pois não há status neste modelo
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Edit2, Trash2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { parse, format } from 'date-fns';

type Certificado = {
  id?: number;
  nomeEmp?: string;
  nomeCertificado?: string;
  // Em JSON vem como string com padrão dd-MM-yyyy
  dataVencimento?: string;
  [k: string]: any;
};

type Page<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
};

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL ?? 'http://localhost:8080';

async function httpGet<T>(path: string, params?: Record<string, any>): Promise<T> {
  const url = new URL(path, API_BASE_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }
  const token = (() => {
    try { return localStorage.getItem('auth_token') || undefined; } catch { return undefined; }
  })();
  const headers: Record<string, string> = { 'Accept': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url.toString(), {
    headers,
    credentials: 'include',
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error('Não autenticado (401). Faça login novamente.');
    if (res.status === 403) throw new Error('Acesso negado (403). Verifique permissões ou autenticação.');
    throw new Error(`Erro ${res.status} ao consultar ${url.pathname}`);
  }
  return res.json();
}

async function httpPatch<T>(path: string, body: any): Promise<T> {
  const url = new URL(path, API_BASE_URL);
  const token = (() => {
    try { return localStorage.getItem('auth_token') || undefined; } catch { return undefined; }
  })();
  const headers: Record<string, string> = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url.toString(), { method: 'PATCH', headers, body: JSON.stringify(body), credentials: 'include' });
  if (!res.ok) {
    if (res.status === 401) throw new Error('Não autenticado (401). Faça login novamente.');
    if (res.status === 403) throw new Error('Acesso negado (403). Verifique permissões ou autenticação.');
    throw new Error(`Erro ${res.status} ao atualizar ${url.pathname}`);
  }
  return (await res.text()) as unknown as T;
}

async function httpDelete<T>(path: string): Promise<T> {
  const url = new URL(path, API_BASE_URL);
  const token = (() => {
    try { return localStorage.getItem('auth_token') || undefined; } catch { return undefined; }
  })();
  const headers: Record<string, string> = { 'Accept': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url.toString(), { method: 'DELETE', headers, credentials: 'include' });
  if (!res.ok) {
    if (res.status === 401) throw new Error('Não autenticado (401). Faça login novamente.');
    if (res.status === 403) throw new Error('Acesso negado (403). Verifique permissões ou autenticação.');
    throw new Error(`Erro ${res.status} ao excluir ${url.pathname}`);
  }
  return (await res.text()) as unknown as T;
}

function useCertificados(mode: string, args: { page?: number; size?: number; sort?: string; dir?: string; dataIni?: string; dataFim?: string; nome?: string; empresa?: string }) {
  return useQuery({
    queryKey: ['certificados', mode, args],
    queryFn: async () => {
      switch (mode) {
        case 'lista':
          return httpGet<Certificado[]>(`/Listar/ListarCertificados`);
        case 'paginado':
          return httpGet<Page<Certificado>>(`/Listar/ListarCertificadosPaginado`, {
            page: args.page ?? 0,
            size: args.size ?? 10,
            sort: args.sort,
            dir: args.dir ?? 'asc',
          });
        case 'data':
          if (!args.dataIni || !args.dataFim) throw new Error('Informe data inicial e final');
          return httpGet<Certificado[]>(`/Listar/ListarCertificadosPorData/${args.dataIni.split('/').reverse().join('-')}/${args.dataFim.split('/').reverse().join('-')}`);
        case 'dataPaginado':
          if (!args.dataIni || !args.dataFim) throw new Error('Informe data inicial e final');
          return httpGet<Page<Certificado>>(
            `/Listar/ListarCertificadosPorDataPaginado/${args.dataIni ? args.dataIni.split('/').reverse().join('-') : ''}/${args.dataFim ? args.dataFim.split('/').reverse().join('-') : ''}`,
            { page: args.page ?? 0, size: args.size ?? 10, sort: args.sort, dir: args.dir ?? 'asc' },
          );
        case 'nome':
          return httpGet<Certificado[]>(`/Listar/ListarCertificadosPorNome`, { nome: args.nome });
        case 'nomePaginado':
          return httpGet<Page<Certificado>>(`/Listar/ListarCertificadosPorNomePaginado`, {
            nome: args.nome,
            page: args.page ?? 0,
            size: args.size ?? 10,
            sort: args.sort,
            dir: args.dir ?? 'asc',
          });
        case 'empresa':
          return httpGet<Certificado[]>(`/Listar/ListarCertificadosPorEmpresa`, { empresa: args.empresa });
        case 'empresaPaginado':
          return httpGet<Page<Certificado>>(`/Listar/ListarCertificadosPorEmpresaPaginado`, {
            empresa: args.empresa,
            page: args.page ?? 0,
            size: args.size ?? 10,
            sort: args.sort,
            dir: args.dir ?? 'asc',
          });
        case 'filtradoPaginado':
          return httpGet<Page<Certificado>>(`/Listar/ListarCertificadosFiltradosPaginado`, {
            nome: args.nome,
            empresa: args.empresa,
            dataIni: args.dataIni,
            dataFim: args.dataFim,
            page: args.page ?? 0,
            size: args.size ?? 10,
            sort: args.sort,
            dir: args.dir ?? 'asc',
          });
        default:
          return httpGet<Certificado[]>(`/Listar/ListarCertificados`);
      }
    },
    refetchOnWindowFocus: false,
  });
}

export default function Certificados() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams<{ nome?: string }>();
  const [mode, setMode] = useState<'lista' | 'paginado' | 'data' | 'dataPaginado' | 'nome' | 'nomePaginado' | 'empresa' | 'empresaPaginado' | 'filtradoPaginado'>('lista');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sort, setSort] = useState<string | undefined>(undefined);
  const [dir, setDir] = useState<'asc' | 'desc'>('asc');
  const [dataIni, setDataIni] = useState<string>('');
  const [dataFim, setDataFim] = useState<string>('');
  const [nome, setNome] = useState<string>('');
  const [empresa, setEmpresa] = useState<string>('');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingOriginalName, setEditingOriginalName] = useState<string>('');
  const [editingData, setEditingData] = useState<Certificado>({});

  const { data, isLoading, error } = useCertificados(mode, { page, size, sort, dir, dataIni, dataFim, nome, empresa });

  const updateMutation = useMutation({
    mutationFn: async ({ nomeCertificado, body }: { nomeCertificado: string; body: any }) =>
      httpPatch<string>(`/Atualizar/AtualizarCertificado/${encodeURIComponent(nomeCertificado)}`, body),
    onSuccess: () => {
      toast({ title: 'Certificado atualizado', description: editingOriginalName });
      queryClient.invalidateQueries({ queryKey: ['certificados'] });
      setIsEditOpen(false);
    },
    onError: (err: any) => {
      toast({ title: 'Erro ao atualizar', description: String(err?.message ?? err), variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (nomeCertificado: string) =>
      httpDelete<string>(`/Deletar/DeletarCertificado/${encodeURIComponent(nomeCertificado)}`),
    onSuccess: (_, nomeCertificado) => {
      toast({ title: 'Certificado excluído', description: nomeCertificado });
      queryClient.invalidateQueries({ queryKey: ['certificados'] });
    },
    onError: (err: any) => {
      toast({ title: 'Erro ao excluir', description: String(err?.message ?? err), variant: 'destructive' });
    },
  });

  const rows: Certificado[] = useMemo(() => {
    if (!data) return [];
    // Suporta retorno lista simples ou Page<Certificado>
    if (Array.isArray(data)) return data;
    if ('content' in (data as any)) return (data as Page<Certificado>).content ?? [];
    return [];
  }, [data]);

  function toBr(dateStr?: string) {
    if (!dateStr) return '';
    try {
      const d1 = parse(dateStr, 'dd-MM-yyyy', new Date());
      if (!isNaN(d1.getTime())) return format(d1, 'dd/MM/yyyy');
      const d2 = parse(dateStr, 'yyyy-MM-dd', new Date());
      if (!isNaN(d2.getTime())) return format(d2, 'dd/MM/yyyy');
    } catch {}
    return dateStr;
  }

  function brToIso(dateBr?: string) {
    if (!dateBr) return '';
    try {
      const d = parse(dateBr, 'dd/MM/yyyy', new Date());
      if (!isNaN(d.getTime())) return format(d, 'yyyy-MM-dd');
    } catch {}
    return dateBr;
  }

  function brToDash(dateBr?: string) {
    if (!dateBr) return '';
    try {
      const d = parse(dateBr, 'dd/MM/yyyy', new Date());
      if (!isNaN(d.getTime())) return format(d, 'dd-MM-yyyy');
    } catch {}
    return dateBr;
  }

  useEffect(() => {
    const nomeParam = params.nome ? decodeURIComponent(params.nome) : undefined;
    if (!nomeParam) return;
    const isEditRoute = location.pathname.startsWith('/certificados/editar/');
    const isDeleteRoute = location.pathname.startsWith('/certificados/deletar/');
    if (isEditRoute && rows.length > 0) {
      const found = rows.find((r) => r.nomeCertificado === nomeParam);
      if (found) {
        setEditingOriginalName(found.nomeCertificado ?? '');
        setEditingData({ ...found, dataVencimento: toBr(found.dataVencimento) });
        setIsEditOpen(true);
      }
    } else if (isDeleteRoute) {
      deleteMutation.mutate(nomeParam, {
        onSuccess: () => {
          navigate('/certificados', { replace: true });
        },
      } as any);
    }
  }, [params.nome, rows, location.pathname]);

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Certificados</h1>
        </div>

        <div className="bg-card rounded-lg border border-border shadow-card">
          <div className="p-4 space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button variant={mode === 'lista' ? 'default' : 'outline'} onClick={() => setMode('lista')}>Lista</Button>
              <Button variant={mode === 'paginado' ? 'default' : 'outline'} onClick={() => setMode('paginado')}>Paginado</Button>
              <Button variant={mode === 'data' ? 'default' : 'outline'} onClick={() => setMode('data')}>Por Data</Button>
              <Button variant={mode === 'dataPaginado' ? 'default' : 'outline'} onClick={() => setMode('dataPaginado')}>Data Paginado</Button>
              <Button variant={mode === 'nome' ? 'default' : 'outline'} onClick={() => setMode('nome')}>Por Nome</Button>
              <Button variant={mode === 'nomePaginado' ? 'default' : 'outline'} onClick={() => setMode('nomePaginado')}>Nome Paginado</Button>
              <Button variant={mode === 'empresa' ? 'default' : 'outline'} onClick={() => setMode('empresa')}>Por Empresa</Button>
              <Button variant={mode === 'empresaPaginado' ? 'default' : 'outline'} onClick={() => setMode('empresaPaginado')}>Empresa Paginado</Button>
              <Button variant={mode === 'filtradoPaginado' ? 'default' : 'outline'} onClick={() => setMode('filtradoPaginado')}>Filtrado Paginado</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataIni">Data Inicial</Label>
                <Input id="dataIni" type="text" placeholder="dd/MM/yyyy" value={dataIni} onChange={(e) => setDataIni(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataFim">Data Final</Label>
                <Input id="dataFim" type="text" placeholder="dd/MM/yyyy" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nome">Nome (filtro)</Label>
                <Input id="nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Certificado XYZ" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="empresa">Empresa (filtro)</Label>
                <Input id="empresa" type="text" value={empresa} onChange={(e) => setEmpresa(e.target.value)} placeholder="Ex.: Malibru" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">Tamanho da Página</Label>
                <Input id="size" type="number" min={1} value={size} onChange={(e) => setSize(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sort">Sort (opcional)</Label>
                <Input id="sort" value={sort ?? ''} onChange={(e) => setSort(e.target.value || undefined)} placeholder="campo" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="dir">Direção</Label>
                <Input id="dir" value={dir} onChange={(e) => setDir((e.target.value as 'asc' | 'desc') || 'asc')} placeholder="asc/desc" />
              </div>
              {mode === 'paginado' || mode === 'dataPaginado' ? (
                <div className="flex items-end gap-2 md:col-span-2">
                  <Button variant="outline" onClick={() => setPage((p) => Math.max(0, p - 1))}>Anterior</Button>
                  <Button onClick={() => setPage((p) => p + 1)}>Próxima</Button>
                </div>
              ) : null}
            </div>
          </div>

          <div className="p-4 border-t border-border">
            {isLoading ? (
              <p className="text-muted-foreground">Carregando...</p>
            ) : error ? (
              <p className="text-destructive">{(error as Error)?.message}</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Certificado</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-muted-foreground text-center">Nenhum registro</TableCell>
                    </TableRow>
                  ) : (
                    rows.map((item) => (
                      <TableRow key={item.id ?? `${item.nomeCertificado}-${item.dataVencimento}`}>
                        <TableCell>{item.id ?? '-'}</TableCell>
                        <TableCell>{item.nomeEmp ?? '-'}</TableCell>
                        <TableCell>{item.nomeCertificado ?? '-'}</TableCell>
                        <TableCell>{toBr(item.dataVencimento) || '-'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingOriginalName(item.nomeCertificado ?? '');
                                setEditingData({ ...item, dataVencimento: toBr(item.dataVencimento) });
                                setIsEditOpen(true);
                              }}
                              className="gap-2"
                            >
                              <Edit2 className="h-4 w-4" />
                              Editar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => item.nomeCertificado && deleteMutation.mutate(item.nomeCertificado)}
                              className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                              Excluir
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
        <Dialog
          open={isEditOpen}
          onOpenChange={(open) => {
            setIsEditOpen(open);
            if (!open && location.pathname.startsWith('/certificados/editar/')) {
              navigate('/certificados', { replace: true });
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Certificado</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-id">ID</Label>
                <Input id="edit-id" value={editingData.id ?? ''} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-empresa">Empresa</Label>
                <Input id="edit-empresa" value={editingData.nomeEmp ?? ''} onChange={(e) => setEditingData({ ...editingData, nomeEmp: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-certificado">Certificado</Label>
                <Input id="edit-certificado" value={editingData.nomeCertificado ?? ''} onChange={(e) => setEditingData({ ...editingData, nomeCertificado: e.target.value })} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit-vencimento">Vencimento (dd/MM/yyyy)</Label>
                <Input id="edit-vencimento" value={editingData.dataVencimento ?? ''} onChange={(e) => setEditingData({ ...editingData, dataVencimento: e.target.value })} placeholder="dd/MM/yyyy" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancelar</Button>
              <Button
                onClick={() => {
                  if (!editingOriginalName) {
                    toast({ title: 'Nome original não encontrado', variant: 'destructive' });
                    return;
                  }
                  const payload = {
                    id: editingData.id,
                    nomeEmp: editingData.nomeEmp,
                    nomeCertificado: editingData.nomeCertificado,
                    dataVencimento: brToIso(editingData.dataVencimento),
                  };
                  if (!payload.nomeEmp || !payload.nomeCertificado || !payload.dataVencimento) {
                    toast({ title: 'Preencha todos os campos obrigatórios', description: 'Empresa, Certificado e Vencimento', variant: 'destructive' });
                    return;
                  }
                  updateMutation.mutate({ nomeCertificado: editingOriginalName, body: payload });
                }}
              >
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
