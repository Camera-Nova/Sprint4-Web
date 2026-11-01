import { useEffect, useState } from 'react'
import {
  buscarUsuarioLogado,
  fazerCadastro,
  fazerLogin,
  fazerLogout,
} from '../services/api'

const SESSION_KEY = 'jovi_sessao'
const MAIOR_ESPERA_TIMER = 2 ** 31 - 1

const limparSessaoSalva = () => {
  localStorage.removeItem(SESSION_KEY)
  sessionStorage.removeItem(SESSION_KEY)
}

const sessaoExpirou = (sessao) =>
  !sessao?.expiraEm || new Date(sessao.expiraEm) <= new Date()

const lerSessaoSalva = () => {
  const sessaoLocal = localStorage.getItem(SESSION_KEY)
  const sessaoTemporaria = sessionStorage.getItem(SESSION_KEY)
  const sessao = JSON.parse(sessaoLocal || sessaoTemporaria || 'null')

  if (sessao && sessaoExpirou(sessao)) {
    limparSessaoSalva()
    return null
  }

  return sessao
}

const useSessao = () => {
  const [usuario, setUsuario] = useState(lerSessaoSalva)

  const token = usuario?.token
  const expiraEm = usuario?.expiraEm

  useEffect(() => {
    if (!token) return

    buscarUsuarioLogado(token).catch((erro) => {
      if (erro.status === 401) {
        limparSessaoSalva()
        setUsuario(null)
      }
    })
  }, [token])

  useEffect(() => {
    if (!expiraEm) return

    const espera = new Date(expiraEm) - new Date()

    if (espera > MAIOR_ESPERA_TIMER) return

    const temporizador = setTimeout(() => {
      limparSessaoSalva()
      setUsuario(null)
    }, Math.max(espera, 0))

    return () => clearTimeout(temporizador)
  }, [expiraEm])

  const salvarSessao = (resposta, lembrar) => {
    const dadosUsuario = {
      nome: resposta.usuario.nome,
      email: resposta.usuario.email,
      entrouEm: resposta.entrouEm,
      expiraEm: resposta.expiraEm,
      token: resposta.token,
    }

    const armazenamento = lembrar ? localStorage : sessionStorage

    limparSessaoSalva()
    armazenamento.setItem(SESSION_KEY, JSON.stringify(dadosUsuario))
    setUsuario(dadosUsuario)
  }

  const entrar = async (email, senha, lembrar) => {
    const resposta = await fazerLogin(email, senha, lembrar)
    salvarSessao(resposta, lembrar)
  }

  const cadastrar = async (nome, email, senha, confirmacao) => {
    const resposta = await fazerCadastro(nome, email, senha, confirmacao)
    salvarSessao(resposta, false)
  }

  const sair = () => {
    if (token) fazerLogout(token).catch(() => {})

    limparSessaoSalva()
    setUsuario(null)
  }

  return { usuario, entrar, cadastrar, sair }
}

export default useSessao
