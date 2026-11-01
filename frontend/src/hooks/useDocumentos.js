import { useEffect, useState } from 'react'
import * as api from '../services/api'

const prepararDocumento = (token, documento) => ({
  ...documento,
  validade: documento.validade || '',
  imagem:
    documento.visibilidade === 'publico'
      ? api.montarUrlImagem(token, documento.id)
      : null,
})

const useDocumentos = (token) => {
  const [historico, setHistorico] = useState([])
  const [lixeira, setLixeira] = useState([])
  const [erroCarregamento, setErroCarregamento] = useState(null)

  const comImagem = (documento) => prepararDocumento(token, documento)

  useEffect(() => {
    if (!token) return

    Promise.all([api.listarDocumentos(token), api.listarLixeira(token)])
      .then(([documentos, excluidos]) => {
        setHistorico(documentos.map((item) => prepararDocumento(token, item)))
        setLixeira(excluidos.map((item) => prepararDocumento(token, item)))
        setErroCarregamento(null)
      })
      .catch(setErroCarregamento)
  }, [token])

  const adicionarDocumento = async ({ tipo, nome, imagem, validade, visibilidade }) => {
    const arquivo = await fetch(imagem).then((resposta) => resposta.blob())

    const formulario = new FormData()
    formulario.append('tipo', tipo)
    formulario.append('nome', nome)
    formulario.append('validade', validade)
    formulario.append('visibilidade', visibilidade)
    formulario.append('imagem', arquivo, 'digitalizacao.jpg')

    const novoDocumento = await api.criarDocumento(token, formulario)

    setHistorico((itens) => [comImagem(novoDocumento), ...itens])
  }

  const editarDocumento = async (id, dadosEditados) => {
    const documentoEditado = comImagem(
      await api.editarDocumento(token, id, dadosEditados)
    )

    setHistorico((itens) =>
      itens.map((item) => (item.id === id ? documentoEditado : item))
    )

    return documentoEditado
  }

  const moverParaLixeira = async (id) => {
    const documentoRemovido = await api.moverDocumentoParaLixeira(token, id)

    setHistorico((itens) => itens.filter((item) => item.id !== id))
    setLixeira((itens) => [comImagem(documentoRemovido), ...itens])
  }

  const moverTudoParaLixeira = async () => {
    const documentosRemovidos = await api.moverTodosParaLixeira(token)

    setHistorico([])
    setLixeira((itens) => [...documentosRemovidos.map(comImagem), ...itens])
  }

  const restaurarDocumento = async (id) => {
    const documentoRestaurado = await api.restaurarDaLixeira(token, id)

    setLixeira((itens) => itens.filter((item) => item.id !== id))
    setHistorico((itens) => [comImagem(documentoRestaurado), ...itens])
  }

  const excluirDefinitivamente = async (id) => {
    await api.excluirDaLixeira(token, id)

    setLixeira((itens) => itens.filter((item) => item.id !== id))
  }

  const esvaziarLixeira = async () => {
    await api.esvaziarLixeira(token)

    setLixeira([])
  }

  return {
    historico,
    lixeira,
    erroCarregamento,
    adicionarDocumento,
    editarDocumento,
    moverParaLixeira,
    moverTudoParaLixeira,
    restaurarDocumento,
    excluirDefinitivamente,
    esvaziarLixeira,
  }
}

export default useDocumentos
