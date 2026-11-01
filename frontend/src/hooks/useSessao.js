import { useEffect, useState } from 'react'
import { buscarUsuarioLogado, fazerLogin, fazerLogout } from '../services/api'

const SESSION_KEY = 'jovi_sessao'

const limparSessaoSalva = () => {
  localStorage.removeItem(SESSION_KEY)
  sessionStorage.removeItem(SESSION_KEY)
}

const useSessao = () => {
  const [usuario, setUsuario] = useState(() => {
    const sessaoLocal = localStorage.getItem(SESSION_KEY)
    const sessaoTemporaria = sessionStorage.getItem(SESSION_KEY)

    return JSON.parse(sessaoLocal || sessaoTemporaria || 'null')
  })

  const token = usuario?.token

  useEffect(() => {
    if (!token) return

    buscarUsuarioLogado(token).catch((erro) => {
      if (erro.status === 401) {
        limparSessaoSalva()
        setUsuario(null)
      }
    })
  }, [token])

  const entrar = async (email, senha, lembrar) => {
    const resposta = await fazerLogin(email, senha)

    const dadosUsuario = {
      nome: resposta.usuario.nome,
      email: resposta.usuario.email,
      entrouEm: resposta.entrouEm,
      token: resposta.token,
    }

    const armazenamento = lembrar ? localStorage : sessionStorage

    limparSessaoSalva()
    armazenamento.setItem(SESSION_KEY, JSON.stringify(dadosUsuario))
    setUsuario(dadosUsuario)
  }

  const sair = () => {
    if (token) fazerLogout(token).catch(() => {})

    limparSessaoSalva()
    setUsuario(null)
  }

  return { usuario, entrar, sair }
}

export default useSessao
