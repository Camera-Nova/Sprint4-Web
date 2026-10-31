import { useState } from 'react'

const SESSION_KEY = 'jovi_sessao'

const useSessao = () => {
  const [usuario, setUsuario] = useState(() => {
    const sessaoLocal = localStorage.getItem(SESSION_KEY)
    const sessaoTemporaria = sessionStorage.getItem(SESSION_KEY)

    return JSON.parse(sessaoLocal || sessaoTemporaria || 'null')
  })

  const entrar = (dadosUsuario, lembrar) => {
    const armazenamento = lembrar ? localStorage : sessionStorage

    localStorage.removeItem(SESSION_KEY)
    sessionStorage.removeItem(SESSION_KEY)

    armazenamento.setItem(SESSION_KEY, JSON.stringify(dadosUsuario))
    setUsuario(dadosUsuario)
  }

  const sair = () => {
    localStorage.removeItem(SESSION_KEY)
    sessionStorage.removeItem(SESSION_KEY)
    setUsuario(null)
  }

  return { usuario, entrar, sair }
}

export default useSessao
