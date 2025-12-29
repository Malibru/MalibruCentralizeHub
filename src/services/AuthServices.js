const API_URL = 'http://localhost:8080';

export async function loginRequest(login, senha) {
  const response = await fetch(`${API_URL}/Usuarios/Login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      login,
      senha,
    }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Usuário ou senha inválidos');
    }
    throw new Error('Erro ao realizar login');
  }

  return response.json(); // LoginResponseDTO
}
