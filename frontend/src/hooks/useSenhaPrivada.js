import { useEffect, useState } from 'react'
import * as api from '../services/api'

const useSenhaPrivada = (token) => {
  const [senhaConfigurada, setSenhaConfigurada] = useState(false)

  useEffect(() => {
    if (!token) return

    api
      .consultarSenhaPrivada(token)
      .then((resposta) => setSenhaConfigurada(resposta.configurada))
      .catch(() => setSenhaConfigurada(false))
  }, [token])

  const salvarSenhaPrivada = async (senha, confirmacao) => {
    await api.salvarSenhaPrivada(token, senha, confirmacao)
    setSenhaConfigurada(true)
  }

  const desbloquearDocumento = async (documento, senha) => {
    const { chave } = await api.desbloquearDocumento(token, documento.id, senha)

    return {
      ...documento,
      imagem: api.montarUrlImagem(token, documento.id, chave),
    }
  }

  const liberarDocumentosParaExportar = async (documentos, senha) => {
    const { chave } = await api.liberarExportacao(token, senha)

    return documentos.map((documento) => ({
      ...documento,
      imagem: api.montarUrlImagem(token, documento.id, chave),
    }))
  }

  return {
    senhaConfigurada,
    salvarSenhaPrivada,
    desbloquearDocumento,
    liberarDocumentosParaExportar,
  }
}

export default useSenhaPrivada
