import { useEffect, useState } from 'react'

const STORAGE_KEY = 'jovi_historico'
const TRASH_KEY = 'jovi_lixeira'

const useDocumentos = () => {
  const [historico, setHistorico] = useState(() => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  })

  const [lixeira, setLixeira] = useState(() => {
    return JSON.parse(localStorage.getItem(TRASH_KEY) || '[]')
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(historico))
  }, [historico])

  useEffect(() => {
    localStorage.setItem(TRASH_KEY, JSON.stringify(lixeira))
  }, [lixeira])

  const adicionarDocumento = ({ tipo, nome, imagem, validade, visibilidade }) => {
    const qualidade = Math.round(85 + Math.random() * 15)

    const novoDocumento = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      tipo,
      nome,
      imagem,
      validade,
      visibilidade,
      qualidade,
      data: new Date().toISOString(),
    }

    setHistorico((itens) => [novoDocumento, ...itens])
  }

  const editarDocumento = (id, dadosEditados) => {
    setHistorico((itens) =>
      itens.map((item) =>
        item.id === id
          ? {
              ...item,
              ...dadosEditados,
            }
          : item
      )
    )
  }

  const moverParaLixeira = (id) => {
    const documentoRemovido = historico.find((item) => item.id === id)

    if (!documentoRemovido) return

    const itemNaLixeira = {
      ...documentoRemovido,
      excluidoEm: new Date().toISOString(),
    }

    setHistorico((itens) => itens.filter((item) => item.id !== id))
    setLixeira((itens) => [itemNaLixeira, ...itens])
  }

  const moverTudoParaLixeira = () => {
    const itensExcluidos = historico.map((item) => ({
      ...item,
      excluidoEm: new Date().toISOString(),
    }))

    setLixeira((itens) => [...itensExcluidos, ...itens])
    setHistorico([])
  }

  const restaurarDocumento = (id) => {
    const documentoRestaurado = lixeira.find((item) => item.id === id)

    if (!documentoRestaurado) return

    const documentoSemDataExclusao = { ...documentoRestaurado }
    delete documentoSemDataExclusao.excluidoEm

    setLixeira((itens) => itens.filter((item) => item.id !== id))
    setHistorico((itens) => [documentoSemDataExclusao, ...itens])
  }

  const excluirDefinitivamente = (id) => {
    setLixeira((itens) => itens.filter((item) => item.id !== id))
  }

  const esvaziarLixeira = () => {
    setLixeira([])
  }

  return {
    historico,
    lixeira,
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
