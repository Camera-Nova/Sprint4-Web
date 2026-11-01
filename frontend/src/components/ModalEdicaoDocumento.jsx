import {useState} from 'react'

const ModalEdicaoDocumento = ({ documento, onFechar, onSalvar }) => {
  const [nome, setNome] = useState(documento?.nome || '')
  const [validade, setValidade] = useState(documento?.validade || '')
  const [visibilidade, setVisibilidade] = useState(
    documento?.visibilidade || 'privado'
  )
  const [erro, setErro] = useState('')
  const [documentoAnterior, setDocumentoAnterior] = useState(documento)

  if (documento !== documentoAnterior) {
    setDocumentoAnterior(documento)

    if (documento) {
      setNome(documento.nome || '')
      setValidade(documento.validade || '')
      setVisibilidade(documento.visibilidade || 'privado')
      setErro('')
    }
  }

  if (!documento) return null

  const salvar = (evento) => {
    evento.preventDefault()

    if (!nome.trim()) {
      setErro('O nome do documento é obrigatório.')
      return
    }

    onSalvar(documento.id, {
      nome: nome.trim(),
      validade,
      visibilidade,
    })
  }

  return (
    <div className="fixed inset-0 z-100 grid p-4 bg-black/80 place-items-center" onClick={onFechar}>
      <section
        className="w-full max-w-[760px] p-6 text-[#e8ecf4] bg-[#161a22] border border-[#2a3142] rounded-2xl"
        onClick={(evento) => evento.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="m-0 text-[1.5em] font-bold">Editar documento</h2>
            <p className="mt-[0.4rem] mb-4 text-[#a0a8bd]">Atualize as informações do documento digitalizado.</p>
          </div>

          <button className="px-[0.7rem] py-2 text-[#e8ecf4] bg-transparent border border-[#2a3142] rounded-lg cursor-pointer" onClick={onFechar}>
            Fechar
          </button>
        </div>

        <form onSubmit={salvar}>
          <div className="grid grid-cols-1 gap-[0.8rem] mt-4 md:grid-cols-3">
            <div>
              <label className="block mb-[0.4rem] text-[0.9rem]" htmlFor="editar-nome">Nome do documento</label>
              <input
                id="editar-nome"
                className="w-full p-3 text-[#e8ecf4] bg-[#1d2230] border border-[#2a3142] rounded-lg"
                type="text"
                value={nome}
                onChange={(evento) => setNome(evento.target.value)}
              />
            </div>

            <div>
              <label className="block mb-[0.4rem] text-[0.9rem]" htmlFor="editar-validade">Data de vencimento</label>
              <input
                id="editar-validade"
                className="w-full p-3 text-[#e8ecf4] bg-[#1d2230] border border-[#2a3142] rounded-lg"
                type="date"
                value={validade}
                onChange={(evento) => setValidade(evento.target.value)}
              />
            </div>

            <div>
              <label className="block mb-[0.4rem] text-[0.9rem]" htmlFor="editar-visibilidade">Privacidade</label>
              <select
                id="editar-visibilidade"
                className="w-full p-3 text-[#e8ecf4] bg-[#1d2230] border border-[#2a3142] rounded-lg"
                value={visibilidade}
                onChange={(evento) => setVisibilidade(evento.target.value)}
              >
                <option value="privado">Privado</option>
                <option value="publico">Público</option>
              </select>
            </div>
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
              Salvar alterações
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default ModalEdicaoDocumento