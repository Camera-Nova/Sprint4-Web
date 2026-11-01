import { useState } from 'react'

const ModalSenhaDocumento = ({
  documento,
  onFechar,
  onLiberar,
}) => {
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState('')
  const [documentoAnterior, setDocumentoAnterior] = useState(documento)

  if (documento !== documentoAnterior) {
    setDocumentoAnterior(documento)

    if (documento) {
      setSenha('')
      setErro('')
      setMostrarSenha(false)
    }
  }

  if (!documento) return null

  const validarSenha = async (evento) => {
    evento.preventDefault()

    try {
      await onLiberar(senha)
    } catch (erroLiberacao) {
      setErro(erroLiberacao.message)
    }
  }

  return (
    <div className="fixed inset-0 z-100 grid p-4 bg-black/80 place-items-center" onClick={onFechar}>
      <section
        className="w-full max-w-[760px] p-6 text-[#e8ecf4] bg-[#161a22] border border-[#2a3142] rounded-2xl"
        onClick={(evento) => evento.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="m-0 text-[1.5em] font-bold">Documento privado</h2>
            <p className="mt-[0.4rem] mb-4 text-[#a0a8bd]">
              Digite a senha padrão para acessar "{documento.nome}".
            </p>
          </div>

          <button className="px-[0.7rem] py-2 text-[#e8ecf4] bg-transparent border border-[#2a3142] rounded-lg cursor-pointer" onClick={onFechar}>
            Fechar
          </button>
        </div>

        <form onSubmit={validarSenha}>
          <label htmlFor="senha-acesso-documento">
            Senha do documento privado
          </label>

          <div className="relative mb-[0.7rem]">
            <input
              id="senha-acesso-documento"
              className="w-full p-3 text-[#e8ecf4] bg-[#1d2230] border border-[#2a3142] rounded-lg pr-[5.5rem]"
              type={mostrarSenha ? 'text' : 'password'}
              value={senha}
              onChange={(evento) => {
                setSenha(evento.target.value)
                setErro('')
              }}
              autoFocus
            />

            <button
              type="button"
              className="absolute top-1/2 right-[0.7rem] -translate-y-1/2 text-[0.85rem] font-bold text-[#4f7cff] bg-transparent border-0 cursor-pointer"
              onClick={() => setMostrarSenha(!mostrarSenha)}
            >
              {mostrarSenha ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>

          {erro && <p className="p-4 text-center text-[#ff7777]">{erro}</p>}

          <div className="flex flex-col items-start gap-[0.8rem] mt-4 sm:flex-row sm:items-stretch sm:justify-end">
            <button
              type="button"
              className="w-full px-4 py-[0.7rem] text-[#e8ecf4] bg-[#1d2230] border border-[#2a3142] rounded-lg cursor-pointer sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onFechar}
            >
              Cancelar
            </button>

            <button type="submit" className="w-full px-4 py-[0.7rem] font-bold text-white bg-[#4f7cff] border-0 rounded-lg cursor-pointer sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed">
              Acessar documento
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default ModalSenhaDocumento