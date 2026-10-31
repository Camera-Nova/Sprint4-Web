import { useEffect, useState } from 'react'
import { jsPDF } from 'jspdf'
import Header from './components/Header'
import Login from './pages/Login'
import ScanActions from './components/ScanActions'
import Camera from './components/Camera'
import Notificacoes from './components/Notificacoes'
import Historico from './pages/Historico'
import ModalDocumento from './components/ModalDocumento'
import Lixeira from './components/Lixeira'
import ModalEdicaoDocumento from './components/ModalEdicaoDocumento'
import SenhaPrivada from './components/SenhaPrivada'
import ModalSenhaDocumento from './components/ModalSenhaDocumento'
import Footer from './components/Footer'


const STORAGE_KEY = 'jovi_historico'
const TRASH_KEY = 'jovi_lixeira'
const SESSION_KEY = 'jovi_sessao'
const PRIVATE_PASSWORD_KEY = 'jovi_senha_privada'

const App = () => {
  const [usuario, setUsuario] = useState(() => {
    const sessaoLocal = localStorage.getItem(SESSION_KEY)
    const sessaoTemporaria = sessionStorage.getItem(SESSION_KEY)

    return JSON.parse(sessaoLocal || sessaoTemporaria || 'null')
  })

  const [historico, setHistorico] = useState(() => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  })

  const [lixeira, setLixeira] = useState(() => {
    return JSON.parse(localStorage.getItem(TRASH_KEY) || '[]')
  })

  const [senhaPrivada, setSenhaPrivada] = useState(() => {
    return localStorage.getItem(PRIVATE_PASSWORD_KEY) || ''
  })

  const [tipoSelecionado, setTipoSelecionado] = useState(null)
  const [documentoSelecionado, setDocumentoSelecionado] = useState(null)
  const [documentoEmEdicao, setDocumentoEmEdicao] = useState(null)
  const [documentoBloqueado, setDocumentoBloqueado] = useState(null)
  const [configurandoSenha, setConfigurandoSenha] = useState(false)
  const [lixeiraAberta, setLixeiraAberta] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(historico))
  }, [historico])

  useEffect(() => {
    localStorage.setItem(TRASH_KEY, JSON.stringify(lixeira))
  }, [lixeira])

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

  const abrirCamera = (tipo) => {
    setTipoSelecionado(tipo)
  }

  const fecharCamera = () => {
    setTipoSelecionado(null)
  }

  const adicionarDigitalizacao = ({
    tipo,
    nome,
    imagem,
    validade,
    visibilidade,
  }) => {
    const qualidade = Math.round(85 + Math.random() * 15)

    const novaDigitalizacao = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      tipo,
      nome,
      imagem,
      validade,
      visibilidade,
      qualidade,
      data: new Date().toISOString(),
    }

    setHistorico((itens) => [novaDigitalizacao, ...itens])
    fecharCamera()
  }

  const removerDigitalizacao = (id) => {
    const documentoRemovido = historico.find((item) => item.id === id)

    if (!documentoRemovido) return

    const itemNaLixeira = {
      ...documentoRemovido,
      excluidoEm: new Date().toISOString(),
    }

    setHistorico((itens) => itens.filter((item) => item.id !== id))
    setLixeira((itens) => [itemNaLixeira, ...itens])

    if (documentoSelecionado?.id === id) {
      setDocumentoSelecionado(null)
    }

    if (documentoEmEdicao?.id === id) {
      setDocumentoEmEdicao(null)
    }

    if (documentoBloqueado?.id === id) {
      setDocumentoBloqueado(null)
    }
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
    if (
      window.confirm(
        'Deseja excluir este documento permanentemente? Esta ação não pode ser desfeita.'
      )
    ) {
      setLixeira((itens) => itens.filter((item) => item.id !== id))
    }
  }

  const limparLixeira = () => {
    if (
      window.confirm(
        'Deseja excluir permanentemente todos os itens da lixeira?'
      )
    ) {
      setLixeira([])
    }
  }

  const salvarEdicaoDocumento = (id, dadosEditados) => {
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

    if (documentoSelecionado?.id === id) {
      setDocumentoSelecionado((item) => ({
        ...item,
        ...dadosEditados,
      }))
    }

    setDocumentoEmEdicao(null)
  }

  const salvarSenhaPrivada = (novaSenha) => {
    localStorage.setItem(PRIVATE_PASSWORD_KEY, novaSenha)
    setSenhaPrivada(novaSenha)
    setConfigurandoSenha(false)
  }

  const abrirDocumento = (documento) => {
    const visibilidade = documento.visibilidade || 'privado'

    if (visibilidade === 'publico') {
      setDocumentoSelecionado(documento)
      return
    }

    if (!senhaPrivada) {
      window.alert(
        'Antes de acessar documentos privados, defina uma senha padrão.'
      )
      setConfigurandoSenha(true)
      return
    }

    setDocumentoBloqueado(documento)
  }

  const liberarDocumentoPrivado = () => {
    setDocumentoSelecionado(documentoBloqueado)
    setDocumentoBloqueado(null)
  }

  const exportarDigitalizacoesPdf = () => {
    const documentosComImagem = historico.filter((item) => item.imagem)

    if (documentosComImagem.length === 0) {
      window.alert('Não há digitalizações com imagem para exportar.')
      return
    }

    const possuiDocumentoPrivado = documentosComImagem.some(
      (item) => (item.visibilidade || 'privado') === 'privado'
    )

    if (possuiDocumentoPrivado) {
      if (!senhaPrivada) {
        window.alert(
          'Defina a senha padrão antes de exportar documentos privados.'
        )
        setConfigurandoSenha(true)
        return
      }

      const senhaInformada = window.prompt(
        'Digite a senha padrão para exportar documentos privados:'
      )

      if (senhaInformada !== senhaPrivada) {
        window.alert('Senha incorreta. O PDF não foi exportado.')
        return
      }
    }

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      documentosComImagem.forEach((documento, indice) => {
        if (indice > 0) {
          pdf.addPage()
        }

        const larguraPagina = 210
        const alturaPagina = 297
        const margem = 20
        const larguraMaxima = larguraPagina - margem * 2
        const alturaMaxima = 205

        const propriedadesImagem = pdf.getImageProperties(documento.imagem)
        const proporcao = propriedadesImagem.width / propriedadesImagem.height

        let larguraImagem = larguraMaxima
        let alturaImagem = larguraImagem / proporcao

        if (alturaImagem > alturaMaxima) {
          alturaImagem = alturaMaxima
          larguraImagem = alturaImagem * proporcao
        }

        const posicaoX = (larguraPagina - larguraImagem) / 2
        const posicaoY = 48

        pdf.setFontSize(18)
        pdf.text('JOVI Scan - Digitalização', margem, 20)

        pdf.setFontSize(13)
        pdf.text(documento.nome, margem, 30)

        pdf.setFontSize(10)
        pdf.text(`Tipo: ${documento.tipo}`, margem, 37)

        const visibilidade =
          documento.visibilidade === 'publico' ? 'Público' : 'Privado'

        pdf.text(`Privacidade: ${visibilidade}`, margem, 42)

        pdf.addImage(
          documento.imagem,
          'JPEG',
          posicaoX,
          posicaoY,
          larguraImagem,
          alturaImagem
        )

        pdf.setFontSize(8)
        pdf.text(
          `Página ${indice + 1} de ${documentosComImagem.length}`,
          margem,
          alturaPagina - 14
        )
      })

      pdf.save('digitalizacoes-jovi-scan.pdf')
    } catch {
      window.alert('Ocorreu um erro ao gerar o PDF. Tente novamente.')
    }
  }

  const limparHistorico = () => {
    if (window.confirm('Deseja mover todas as digitalizações para a lixeira?')) {
      const itensExcluidos = historico.map((item) => ({
        ...item,
        excluidoEm: new Date().toISOString(),
      }))

      setLixeira((itens) => [...itensExcluidos, ...itens])
      setHistorico([])
      setDocumentoSelecionado(null)
      setDocumentoEmEdicao(null)
      setDocumentoBloqueado(null)
    }
  }

  if (!usuario) {
    return <Login onEntrar={entrar} />
  }

  return (
    <div className="flex flex-col min-h-screen font-[Arial,Helvetica,sans-serif] text-[#e8ecf4] bg-[#0f1115]">
      <Header
        usuario={usuario}
        totalDigitalizacoes={historico.length}
        onSair={sair}
        onConfigurarSenha={() => setConfigurandoSenha(true)}
      />

      <main className="flex-1 w-[min(1100px,90%)] mx-auto">
        <section className="pt-16 pb-8">
          <span className="font-bold tracking-[0.08rem] uppercase text-[#4f7cff]">JOVI Scan</span>
          <h1 className="max-w-[700px] my-[0.7rem] text-[clamp(2rem,5vw,3.6rem)] font-bold">
            Digitalize e organize seus documentos.
          </h1>
          <p className="my-4 text-[#a0a8bd]">
            Olá, {usuario.nome}. Use a câmera e mantenha seus documentos
            organizados, privados ou públicos.
          </p>
        </section>

        <Notificacoes itens={historico} />

        <ScanActions onSelecionarTipo={abrirCamera} />

        <Historico
          itens={historico}
          quantidadeLixeira={lixeira.length}
          onRemover={removerDigitalizacao}
          onLimpar={limparHistorico}
          onVisualizar={abrirDocumento}
          onEditar={setDocumentoEmEdicao}
          onExportarPdf={exportarDigitalizacoesPdf}
          onAbrirLixeira={() => setLixeiraAberta(true)}
        />
      </main>

      {tipoSelecionado && (
        <Camera
          tipo={tipoSelecionado}
          quantidade={historico.length}
          onCapturar={adicionarDigitalizacao}
          onFechar={fecharCamera}
        />
      )}

      <Lixeira
        aberta={lixeiraAberta}
        itens={lixeira}
        onFechar={() => setLixeiraAberta(false)}
        onRestaurar={restaurarDocumento}
        onExcluirDefinitivamente={excluirDefinitivamente}
        onLimparLixeira={limparLixeira}
      />

      <ModalDocumento
        documento={documentoSelecionado}
        onFechar={() => setDocumentoSelecionado(null)}
      />

      <ModalEdicaoDocumento
        documento={documentoEmEdicao}
        onFechar={() => setDocumentoEmEdicao(null)}
        onSalvar={salvarEdicaoDocumento}
      />

      <SenhaPrivada
        aberta={configurandoSenha}
        senhaAtual={senhaPrivada}
        onFechar={() => setConfigurandoSenha(false)}
        onSalvar={salvarSenhaPrivada}
      />

      <ModalSenhaDocumento
        documento={documentoBloqueado}
        senhaPadrao={senhaPrivada}
        onFechar={() => setDocumentoBloqueado(null)}
        onLiberar={liberarDocumentoPrivado}
      />

      <Footer />
    </div>
  )
}

export default App