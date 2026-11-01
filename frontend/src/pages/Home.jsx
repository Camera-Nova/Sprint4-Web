import { useEffect, useState } from 'react'
import Header from '../components/Header'
import ScanActions from '../components/ScanActions'
import Camera from '../components/Camera'
import Notificacoes from '../components/Notificacoes'
import Historico from '../components/Historico'
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
    erroCarregamento,
  } = useDocumentos(usuario.token)
  const {
    senhaConfigurada,
    salvarSenhaPrivada,
    desbloquearDocumento,
    liberarDocumentosParaExportar,
  } = useSenhaPrivada(usuario.token)
  const { gerarPdf } = useExportarPdf()

  const [tipoSelecionado, setTipoSelecionado] = useState(null)
  const [documentoSelecionado, setDocumentoSelecionado] = useState(null)
  const [documentoEmEdicao, setDocumentoEmEdicao] = useState(null)
  const [documentoBloqueado, setDocumentoBloqueado] = useState(null)
  const [configurandoSenha, setConfigurandoSenha] = useState(false)
  const [lixeiraAberta, setLixeiraAberta] = useState(false)

  useEffect(() => {
    if (erroCarregamento?.status === 401) onSair()
  }, [erroCarregamento, onSair])

  const executar = async (acao) => {
    try {
      await acao()
      return true
    } catch (erro) {
      if (erro.status === 401) {
        onSair()
        return false
      }

      window.alert(erro.message)
      return false
    }
  }

  const abrirCamera = (tipo) => {
    setTipoSelecionado(tipo)
  }

  const fecharCamera = () => {
    setTipoSelecionado(null)
  }

  const adicionarDigitalizacao = async (dados) => {
    if (await executar(() => adicionarDocumento(dados))) {
      fecharCamera()
    }
  }

  const removerDigitalizacao = async (id) => {
    if (!(await executar(() => moverParaLixeira(id)))) return

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
      executar(() => excluirDefinitivamente(id))
    }
  }

  const limparLixeira = () => {
    if (
      window.confirm(
        'Deseja excluir permanentemente todos os itens da lixeira?'
      )
    ) {
      executar(esvaziarLixeira)
    }
  }

  const salvarEdicaoDocumento = async (id, dadosEditados) => {
    const salvou = await executar(async () => {
      const documentoEditado = await editarDocumento(id, dadosEditados)

      if (documentoSelecionado?.id === id) {
        setDocumentoSelecionado((atual) => ({
          ...documentoEditado,
          imagem: documentoEditado.imagem || atual.imagem,
        }))
      }
    })

    if (salvou) setDocumentoEmEdicao(null)
  }

  const restaurarDaLixeira = (id) => {
    executar(() => restaurarDocumento(id))
  }

  const repassarErro = async (acao) => {
    try {
      await acao()
    } catch (erro) {
      if (erro.status === 401) {
        onSair()
        return
      }

      throw erro
    }
  }

  const salvarSenha = (senha, confirmacao) =>
    repassarErro(async () => {
      await salvarSenhaPrivada(senha, confirmacao)
      setConfigurandoSenha(false)
    })

  const abrirDocumento = (documento) => {
    const visibilidade = documento.visibilidade || 'privado'

    if (visibilidade === 'publico') {
      setDocumentoSelecionado(documento)
      return
    }

    if (!senhaConfigurada) {
      window.alert(
        'Antes de acessar documentos privados, defina uma senha padrão.'
      )
      setConfigurandoSenha(true)
      return
    }

    setDocumentoBloqueado(documento)
  }

  const liberarDocumentoPrivado = (senha) =>
    repassarErro(async () => {
      const documentoLiberado = await desbloquearDocumento(
        documentoBloqueado,
        senha
      )

      setDocumentoSelecionado(documentoLiberado)
      setDocumentoBloqueado(null)
    })

  const exportarDigitalizacoesPdf = async () => {
    if (historico.length === 0) {
      window.alert('Não há digitalizações para exportar.')
      return
    }

    let documentosParaExportar = historico

    const possuiDocumentoPrivado = historico.some(
      (item) => item.visibilidade === 'privado'
    )

    if (possuiDocumentoPrivado) {
      if (!senhaConfigurada) {
        window.alert(
          'Defina a senha padrão antes de exportar documentos privados.'
        )
        setConfigurandoSenha(true)
        return
      }

      const senhaInformada = window.prompt(
        'Digite a senha padrão para exportar documentos privados:'
      )

      if (senhaInformada === null) return

      try {
        documentosParaExportar = await liberarDocumentosParaExportar(
          historico,
          senhaInformada
        )
      } catch (erro) {
        if (erro.status === 401) {
          onSair()
          return
        }

        window.alert(
          erro.status === 403
            ? 'Senha incorreta. O PDF não foi exportado.'
            : erro.message
        )
        return
      }
    }

    try {
      await gerarPdf(documentosParaExportar)
    } catch {
      window.alert('Ocorreu um erro ao gerar o PDF. Tente novamente.')
    }
  }

  const limparHistorico = async () => {
    if (window.confirm('Deseja mover todas as digitalizações para a lixeira?')) {
      if (!(await executar(moverTudoParaLixeira))) return

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

        {erroCarregamento && erroCarregamento.status !== 401 && (
          <p className="p-4 text-center text-[#ff7777]">
            {erroCarregamento.message}
          </p>
        )}

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
        onRestaurar={restaurarDaLixeira}
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
        onFechar={() => setConfigurandoSenha(false)}
        onSalvar={salvarSenha}
      />

      <ModalSenhaDocumento
        documento={documentoBloqueado}
        onFechar={() => setDocumentoBloqueado(null)}
        onLiberar={liberarDocumentoPrivado}
      />

      <Footer />
    </div>
  )
}

export default Home
