import { useState } from 'react'
import Header from '../components/Header'
import ScanActions from '../components/ScanActions'
import Camera from '../components/Camera'
import Notificacoes from '../components/Notificacoes'
import Historico from './Historico'
import ModalDocumento from '../components/ModalDocumento'
import Lixeira from '../components/Lixeira'
import ModalEdicaoDocumento from '../components/ModalEdicaoDocumento'
import SenhaPrivada from '../components/SenhaPrivada'
import ModalSenhaDocumento from '../components/ModalSenhaDocumento'
import Footer from '../components/Footer'
import useDocumentos from '../hooks/useDocumentos'
import useSenhaPrivada from '../hooks/useSenhaPrivada'
import useExportarPdf from '../hooks/useExportarPdf'

const Home = ({ usuario, onSair }) => {
  const {
    historico,
    lixeira,
    adicionarDocumento,
    editarDocumento,
    moverParaLixeira,
    moverTudoParaLixeira,
    restaurarDocumento,
    excluirDefinitivamente,
    esvaziarLixeira,
  } = useDocumentos()
  const { senhaPrivada, salvarSenhaPrivada } = useSenhaPrivada()
  const { gerarPdf } = useExportarPdf()

  const [tipoSelecionado, setTipoSelecionado] = useState(null)
  const [documentoSelecionado, setDocumentoSelecionado] = useState(null)
  const [documentoEmEdicao, setDocumentoEmEdicao] = useState(null)
  const [documentoBloqueado, setDocumentoBloqueado] = useState(null)
  const [configurandoSenha, setConfigurandoSenha] = useState(false)
  const [lixeiraAberta, setLixeiraAberta] = useState(false)

  const abrirCamera = (tipo) => {
    setTipoSelecionado(tipo)
  }

  const fecharCamera = () => {
    setTipoSelecionado(null)
  }

  const adicionarDigitalizacao = (dados) => {
    adicionarDocumento(dados)
    fecharCamera()
  }

  const removerDigitalizacao = (id) => {
    moverParaLixeira(id)

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

  const confirmarExclusaoDefinitiva = (id) => {
    if (
      window.confirm(
        'Deseja excluir este documento permanentemente? Esta ação não pode ser desfeita.'
      )
    ) {
      excluirDefinitivamente(id)
    }
  }

  const limparLixeira = () => {
    if (
      window.confirm(
        'Deseja excluir permanentemente todos os itens da lixeira?'
      )
    ) {
      esvaziarLixeira()
    }
  }

  const salvarEdicaoDocumento = (id, dadosEditados) => {
    editarDocumento(id, dadosEditados)

    if (documentoSelecionado?.id === id) {
      setDocumentoSelecionado((item) => ({
        ...item,
        ...dadosEditados,
      }))
    }

    setDocumentoEmEdicao(null)
  }

  const salvarSenha = (novaSenha) => {
    salvarSenhaPrivada(novaSenha)
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
      gerarPdf(documentosComImagem)
    } catch {
      window.alert('Ocorreu um erro ao gerar o PDF. Tente novamente.')
    }
  }

  const limparHistorico = () => {
    if (window.confirm('Deseja mover todas as digitalizações para a lixeira?')) {
      moverTudoParaLixeira()
      setDocumentoSelecionado(null)
      setDocumentoEmEdicao(null)
      setDocumentoBloqueado(null)
    }
  }

  return (
    <div className="flex flex-col min-h-screen font-[Arial,Helvetica,sans-serif] text-[#e8ecf4] bg-[#0f1115]">
      <Header
        usuario={usuario}
        totalDigitalizacoes={historico.length}
        onSair={onSair}
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
        onExcluirDefinitivamente={confirmarExclusaoDefinitiva}
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
        onSalvar={salvarSenha}
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

export default Home
