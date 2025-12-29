const API_URL = 'http://localhost:8080';

function getToken() {
  try {
    return localStorage.getItem('auth_token');
  } catch {
    return null;
  }
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
    if (response.status === 401) {
      throw new Error('Não autenticado (401)');
    }
    if (response.status === 403) {
      throw new Error('Acesso negado (403)');
    }
    const error = await response.text();
    throw new Error(error || 'Erro na requisição');
  }

  return response;
}

/* =======================
   LISTAR PAGINADO
======================= */
export async function listarLicencasPaginado(page = 0, size = 10, sort, dir = 'asc') {
  const params = new URLSearchParams({
    page,
    size,
    dir,
  });

  if (sort) params.append('sort', sort);

  const res = await request(
    `${API_URL}/Listar/ListarFichasPaginado?${params.toString()}`
  );
  return res.json(); // Page<LicencaOfficeModel>
}

/* =======================
   CADASTRAR
======================= */
export async function cadastrarLicenca(data) {
  const res = await request(
    `${API_URL}/Cadastrar/CadastrarFicha`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
  return res.text();
}

/* =======================
   ATUALIZAR
======================= */
export async function atualizarLicenca(email, data) {
  const res = await request(
    `${API_URL}/Atualizar/AtualizarUmaFicha/${email}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    }
  );
  return res.text();
}

/* =======================
   DELETAR
======================= */
export async function deletarLicenca(email) {
  const res = await request(
    `${API_URL}/Deletar/DeletarFicha/${email}`,
    { method: 'DELETE' }
  );
  return res.text();
}
