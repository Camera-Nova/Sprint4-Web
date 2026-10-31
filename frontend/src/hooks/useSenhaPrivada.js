import { useState } from 'react'

const PRIVATE_PASSWORD_KEY = 'jovi_senha_privada'

const useSenhaPrivada = () => {
  const [senhaPrivada, setSenhaPrivada] = useState(() => {
    return localStorage.getItem(PRIVATE_PASSWORD_KEY) || ''
  })

  const salvarSenhaPrivada = (novaSenha) => {
    localStorage.setItem(PRIVATE_PASSWORD_KEY, novaSenha)
    setSenhaPrivada(novaSenha)
  }

  return { senhaPrivada, salvarSenhaPrivada }
}

export default useSenhaPrivada
