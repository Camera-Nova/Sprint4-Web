import { useState } from 'react'

const SenhaPrivada = ({ aberta, senhaConfigurada, onFechar, onSalvar }) => {
  const [senhaAtual, setSenhaAtual] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmacao, setConfirmacao] = useState('')
  const [erro, setErro] = useState('')
  const [abertaAnterior, setAbertaAnterior] = useState(aberta)

  if (aberta !== abertaAnterior) {
    setAbertaAnterior(aberta)

    if (aberta) {
      setSenhaAtual('')
      setSenha('')
      setConfirmacao('')
      setErro('')
    }
  }

  if (!aberta) return null

  const salvar = async (evento) => {
    evento.preventDefault()

    if (senhaConfigurada && !senhaAtual) {
      setErro('Informe a senha atual.')
      return
    }

    if (senha.trim().length < 4) {
      setErro('A senha deve ter pelo menos 4 caracteres.')
      return
    }

    if (senha !== confirmacao) {
      setErro('A confirmação de senha não é igual.')
      return
    }

    try {
      await onSalvar(senha, confirmacao, senhaConfigurada ? senhaAtual : undefined)
    } catch (erroSalvar) {
      setErro(erroSalvar.message)
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
            <h2 className="m-0 text-[1.5em] font-bold">Senha padrão para documentos privados</h2>
            <p className="mt-[0.4rem] mb-4 text-[#a0a8bd]">
              Esta senha será solicitada para abrir qualquer documento privado.
            </p>
          </div>

          <button className="px-[0.7rem] py-2 text-[#e8ecf4] bg-transparent border border-[#2a3142] rounded-lg cursor-pointer" onClick={onFechar}>
            Fechar
          </button>
        </div>

        <form onSubmit={salvar}>
          <div className="grid gap-[0.8rem]">
            {senhaConfigurada && (
              <div>
                <label htmlFor="senha-privada-atual">Senha atual</label>

                <input
                  id="senha-privada-atual"
                  className="w-full p-3 text-[#e8ecf4] bg-[#1d2230] border border-[#2a3142] rounded-lg"
                  type="password"
                  value={senhaAtual}
                  onChange={(evento) => setSenhaAtual(evento.target.value)}
                />
              </div>
            )}

            <div>
              <label htmlFor="senha-privada">
                {senhaConfigurada ? 'Nova senha padrão' : 'Senha padrão'}
              </label>

              <input
                id="senha-privada"
                className="w-full p-3 text-[#e8ecf4] bg-[#1d2230] border border-[#2a3142] rounded-lg"
                type="password"
                value={senha}
                onChange={(evento) => setSenha(evento.target.value)}
              />
            </div>

            <div>
              <label htmlFor="confirmar-senha-privada">
                Confirmar senha
              </label>

              <input
                id="confirmar-senha-privada"
                className="w-full p-3 text-[#e8ecf4] bg-[#1d2230] border border-[#2a3142] rounded-lg"
                type="password"
                value={confirmacao}
                onChange={(evento) => setConfirmacao(evento.target.value)}
              />
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
              Salvar senha
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default SenhaPrivada