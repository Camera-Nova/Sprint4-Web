export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const extrairMensagemErro = (dados) => {
  if (typeof dados?.detail === 'string') return dados.detail

  // Erros de validação do Pydantic chegam como lista.
  if (Array.isArray(dados?.detail) && dados.detail[0]?.msg) {
    return dados.detail[0].msg.replace(/^Value error, /, '')
  }

  return 'Verifique os dados informados.'
}

const requisitar = async (caminho, { metodo = 'GET', corpo, token } = {}) => {
  const cabecalhos = {}
  const ehFormulario = corpo instanceof FormData

  if (corpo !== undefined && !ehFormulario) {
    cabecalhos['Content-Type'] = 'application/json'
  }
  if (token) cabecalhos.Authorization = `Bearer ${token}`

  let resposta

  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      method: metodo,
      headers: cabecalhos,
      body: ehFormulario || corpo === undefined ? corpo : JSON.stringify(corpo),
    })
  } catch {
    throw new Error('Não foi possível conectar ao servidor.')
  }

  const dados = await resposta.json().catch(() => null)

  if (!resposta.ok) {
    const erro = new Error(extrairMensagemErro(dados))
    erro.status = resposta.status
    throw erro
  }

  return dados
}

// Autenticação

export const fazerLogin = (email, senha) =>
  requisitar('/auth/login', { metodo: 'POST', corpo: { email, senha } })

export const buscarUsuarioLogado = (token) =>
  requisitar('/auth/me', { token })

export const fazerLogout = (token) =>
  requisitar('/auth/logout', { metodo: 'POST', token })

// Documentos

export const listarDocumentos = (token) =>
  requisitar('/documentos', { token })

export const criarDocumento = (token, formulario) =>
  requisitar('/documentos', { metodo: 'POST', corpo: formulario, token })

export const editarDocumento = (token, id, dados) =>
  requisitar(`/documentos/${id}`, { metodo: 'PATCH', corpo: dados, token })

export const moverDocumentoParaLixeira = (token, id) =>
  requisitar(`/documentos/${id}`, { metodo: 'DELETE', token })

export const moverTodosParaLixeira = (token) =>
  requisitar('/documentos', { metodo: 'DELETE', token })

export const montarUrlImagem = (token, id) =>
  `${API_URL}/documentos/${id}/imagem?token=${encodeURIComponent(token)}`

// Lixeira

export const listarLixeira = (token) =>
  requisitar('/lixeira', { token })

export const restaurarDaLixeira = (token, id) =>
  requisitar(`/lixeira/${id}/restaurar`, { metodo: 'POST', token })

export const excluirDaLixeira = (token, id) =>
  requisitar(`/lixeira/${id}`, { metodo: 'DELETE', token })

export const esvaziarLixeira = (token) =>
  requisitar('/lixeira', { metodo: 'DELETE', token })
