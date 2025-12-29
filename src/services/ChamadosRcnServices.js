const API_URL = 'http://localhost:8080';

function getAuthHeaders(extraHeaders = {}) {
  let token = null;

  try {
    token = localStorage.getItem('auth_token');
  } catch (e) {
    token = null;
  }

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extraHeaders,
  };
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: getAuthHeaders(options.headers),
    credentials: 'include',
  });

  if (!response.ok) {
    let errorMessage = `Erro ${response.status}`;

    try {
      const text = await response.text();
      if (text) errorMessage = text;
    } catch (_) {}

    if (response.status === 401) {
      throw new Error('Não autenticado (401). Faça login novamente.');
    }

    if (response.status === 403) {
      throw new Error('Acesso negado (403). Você não tem permissão.');
    }

    throw new Error(errorMessage);
  }

  return response;
}

export async function listarChamados() {
  const res = await request(
    `${API_URL}/Listar/ListarChamadosRcn`,
    { method: 'GET' }
  );
  return res.json();
}

export async function listarChamadosPaginado(page = 0, size = 10) {
  const res = await request(
    `${API_URL}/Listar/ListarChamadosRcnPaginado?page=${page}&size=${size}`,
    { method: 'GET' }
  );
  return res.json();
}

export async function buscarChamadoPorTicket(ticket) {
  const res = await request(
    `${API_URL}/Listar/BuscarChamadoPorTicket/${ticket}`,
    { method: 'GET' }
  );
  return res.json();
}

export async function cadastrarChamado(data) {
  const res = await request(
    `${API_URL}/Cadastrar/CadastrarChamado`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
  return res.text();
}

export async function atualizarChamado(ticket, data) {
  const res = await request(
    `${API_URL}/Atualizar/AtualizarUmChamado/${ticket}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    }
  );
  return res.text();
}

export async function deletarChamado(ticket) {
  const res = await request(
    `${API_URL}/Deletar/DeletarChamado/${ticket}`,
    { method: 'DELETE' }
  );
  return res.text();
}
