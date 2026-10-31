import { useState } from 'react'
import useCamera from '../hooks/useCamera'

const Camera = ({ tipo, quantidade, onCapturar, onFechar }) => {
  const { videoRef, canvasRef, erro, setErro, carregando, capturarImagem } =
    useCamera()

  const [nome, setNome] = useState(`${tipo} ${quantidade + 1}`)
  const [validade, setValidade] = useState('')
  const [visibilidade, setVisibilidade] = useState('privado')

  const dataHoje = new Date().toISOString().slice(0, 10)

  const capturarFoto = () => {
    const imagem = capturarImagem()

    if (!imagem) return

    if (!nome.trim()) {
      setErro('Digite um nome para a digitalização.')
      return
    }

    onCapturar({
      tipo,
      nome: nome.trim(),
      imagem,
      validade,
      visibilidade,
    })
  }

  return (
    <div className="fixed inset-0 z-100 grid p-4 bg-black/80 place-items-center">
      <section className="w-full max-w-[760px] p-6 text-[#e8ecf4] bg-[#161a22] border border-[#2a3142] rounded-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="m-0 text-[1.5em] font-bold">Digitalizar: {tipo}</h2>
            <p className="mt-[0.4rem] mb-4 text-[#a0a8bd]">Posicione o documento dentro da área da câmera.</p>
          </div>

          <button className="px-[0.7rem] py-2 text-[#e8ecf4] bg-transparent border border-[#2a3142] rounded-lg cursor-pointer" onClick={onFechar}>
            Fechar
          </button>
        </div>

        <div className="grid min-h-[280px] overflow-hidden bg-[#0f1115] border border-[#2a3142] rounded-xl place-items-center">
          {carregando && !erro && (
            <p className="p-4 text-center text-[#a0a8bd]">Iniciando câmera...</p>
          )}

          {erro ? (
            <p className="p-4 text-center text-[#ff7777]">{erro}</p>
          ) : (
            <video
              ref={videoRef}
              className="w-full h-full max-h-[480px] object-contain"
              autoPlay
              playsInline
              muted
            />
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <div className="grid grid-cols-1 gap-[0.8rem] mt-4 md:grid-cols-3">
          <div>
            <label className="block mb-[0.4rem] text-[0.9rem]" htmlFor="nome-documento">Nome da digitalização</label>
            <input
              id="nome-documento"
              className="w-full p-3 text-[#e8ecf4] bg-[#1d2230] border border-[#2a3142] rounded-lg"
              type="text"
              value={nome}
              onChange={(evento) => setNome(evento.target.value)}
            />
          </div>

          <div>
            <label className="block mb-[0.4rem] text-[0.9rem]" htmlFor="validade-documento">
              Data de vencimento
            </label>
            <input
              id="validade-documento"
              className="w-full p-3 text-[#e8ecf4] bg-[#1d2230] border border-[#2a3142] rounded-lg"
              type="date"
              min={dataHoje}
              value={validade}
              onChange={(evento) => setValidade(evento.target.value)}
            />
          </div>

          <div>
            <label className="block mb-[0.4rem] text-[0.9rem]" htmlFor="visibilidade-documento">Privacidade</label>
            <select
              id="visibilidade-documento"
              className="w-full p-3 text-[#e8ecf4] bg-[#1d2230] border border-[#2a3142] rounded-lg"
              value={visibilidade}
              onChange={(evento) => setVisibilidade(evento.target.value)}
            >
              <option value="privado">Privado</option>
              <option value="publico">Público</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col items-start gap-[0.8rem] mt-4 sm:flex-row sm:items-stretch sm:justify-end">
          <button className="w-full px-4 py-[0.7rem] text-[#e8ecf4] bg-[#1d2230] border border-[#2a3142] rounded-lg cursor-pointer sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed" onClick={onFechar}>
            Cancelar
          </button>

          <button
            className="w-full px-4 py-[0.7rem] font-bold text-white bg-[#4f7cff] border-0 rounded-lg cursor-pointer sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={capturarFoto}
            disabled={carregando || Boolean(erro)}
          >
            Capturar foto
          </button>
        </div>
      </section>
    </div>
  )
}

export default Camera