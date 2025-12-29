const API_URL = 'http://localhost:8080';

function getToken() {
  return localStorage.getItem('auth_token');
}

async function request(url, options = {}) {
  const token = getToken();

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error('Não autenticado');
    if (response.status === 403) throw new Error('Acesso negado');
    const text = await response.text();
    throw new Error(text || 'Erro na requisição');
  }

  return response;
}

/* =======================
   LISTAR PAGINADO
======================= */
export async function listarEquipamentosPaginado(page = 0, size = 10, sort, dir = 'asc') {
  const params = new URLSearchParams({ page, size, dir });
  if (sort) params.append('sort', sort);

  const res = await request(
    `${API_URL}/Listar/ListarEquipamentosPaginado?${params.toString()}`
  );
  return res.json(); // Page<EquipamentosModel>
}

/* =======================
   CADASTRAR
======================= */
export async function cadastrarEquipamento(data) {
  const res = await request(
    `${API_URL}/Cadastrar/CadastrarEquipamento`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
  return res.text();
}

/* =======================
   ATUALIZAR (por nome)
======================= */
export async function atualizarEquipamento(nome, data) {
  const res = await request(
    `${API_URL}/Atualizar/AtualizarEquipamento/${nome}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    }
  );
  return res.text();
}

/* =======================
   DELETAR (por nome)
======================= */
export async function deletarEquipamento(nome) {
  const res = await request(
    `${API_URL}/Deletar/DeletarEquipamento/${nome}`,
    { method: 'DELETE' }
  );
  return res.text();
}
