const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const requisitar = async (caminho, { metodo = 'GET', corpo, token } = {}) => {
  const cabecalhos = {}

  if (corpo !== undefined) cabecalhos['Content-Type'] = 'application/json'
  if (token) cabecalhos.Authorization = `Bearer ${token}`

  let resposta

  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      method: metodo,
      headers: cabecalhos,
      body: corpo !== undefined ? JSON.stringify(corpo) : undefined,
    })
  } catch {
    throw new Error('Não foi possível conectar ao servidor.')
  }

  const dados = await resposta.json().catch(() => null)

  if (!resposta.ok) {
    const erro = new Error(
      typeof dados?.detail === 'string'
        ? dados.detail
        : 'Verifique os dados informados.'
    )
    erro.status = resposta.status
    throw erro
  }

  return dados
}

export const fazerLogin = (email, senha) =>
  requisitar('/auth/login', { metodo: 'POST', corpo: { email, senha } })

export const buscarUsuarioLogado = (token) =>
  requisitar('/auth/me', { token })

export const fazerLogout = (token) =>
  requisitar('/auth/logout', { metodo: 'POST', token })
