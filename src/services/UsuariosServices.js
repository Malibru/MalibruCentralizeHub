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
   LOGIN
======================= */
export async function login(login, senha) {
  const res = await request(`${API_URL}/Usuarios/Login`, {
    method: 'POST',
    body: JSON.stringify({ login, senha }),
  });
  return res.json(); // LoginResponseDTO
}

/* =======================
   LISTAR USUÁRIOS PAGINADO
======================= */
export async function listarUsuariosPaginado(page = 0, size = 10, sort, dir = 'asc') {
  const params = new URLSearchParams({ page, size, dir });
  if (sort) params.append('sort', sort);

  const res = await request(
    `${API_URL}/Listar/ListarUsuariosPaginado?${params.toString()}`
  );
  return res.json(); // Page<UsuarioModel>
}

/* =======================
   CADASTRAR
======================= */
export async function cadastrarUsuario(data) {
  const res = await request(`${API_URL}/Usuarios/Registrar`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.json();
}

/* =======================
   ATUALIZAR
======================= */
export async function atualizarUsuario(id, data) {
  const res = await request(`${API_URL}/Usuarios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return res.json();
}

/* =======================
   DELETAR
======================= */
export async function deletarUsuario(login) {
  const res = await request(
    `${API_URL}/Deletar/DeletarUsuario/${login}`,
    { method: 'DELETE' }
  );
  return res.text();
}
