import { useState } from 'react'
import { Link } from 'react-router-dom'

const Cadastro = ({ onCadastrar }) => {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmacao, setConfirmacao] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const validarCadastro = async (evento) => {
    evento.preventDefault()

    if (senha.length < 8) {
      setErro('A senha deve ter pelo menos 8 caracteres.')
      return
    }

    if (!/[A-Za-z]/.test(senha) || !/\d/.test(senha)) {
      setErro('A senha deve ter letras e números.')
      return
    }

    if (senha !== confirmacao) {
      setErro('A confirmação de senha não é igual.')
      return
    }

    setErro('')
    setCarregando(true)

    try {
      await onCadastrar(nome.trim(), email.trim().toLowerCase(), senha, confirmacao)
    } catch (erroCadastro) {
      setErro(erroCadastro.message)
      setCarregando(false)
    }
  }

  const alterarCampo = (setCampo) => (evento) => {
    setCampo(evento.target.value)
    setErro('')
  }

  return (
    <main className="grid min-h-screen p-6 font-[Arial,Helvetica,sans-serif] text-[#e8ecf4] bg-linear-135 from-[#0f1115] to-[#1a1f2e] place-items-center">
      <section className="w-full max-w-[420px] p-8 bg-[#161a22] border border-[#2a3142] rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
        <div className="mb-8 text-[2rem] font-extrabold text-center">
          JOVI<span className="text-[#4f7cff]">Scan</span>
        </div>

        <h1 className="mt-[0.67em] mb-[0.4rem] text-[2em] font-bold">Criar conta</h1>
        <p className="mt-0 mb-6 text-[#a0a8bd]">Cadastre-se para digitalizar seus documentos.</p>

        <form className="grid gap-[0.6rem]" onSubmit={validarCadastro}>
          <label htmlFor="nome">Nome</label>
          <input
            id="nome"
            type="text"
            className="w-full p-3 text-[#e8ecf4] bg-[#1d2230] border border-[#2a3142] rounded-lg"
            placeholder="Seu nome"
            value={nome}
            onChange={alterarCampo(setNome)}
            required
          />

          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            className="w-full p-3 text-[#e8ecf4] bg-[#1d2230] border border-[#2a3142] rounded-lg"
            placeholder="voce@email.com"
            value={email}
            onChange={alterarCampo(setEmail)}
            required
          />

          <label htmlFor="senha">Senha</label>
          <div className="relative">
            <input
              id="senha"
              type={mostrarSenha ? 'text' : 'password'}
              className="w-full p-3 text-[#e8ecf4] bg-[#1d2230] border border-[#2a3142] rounded-lg pr-[5.5rem]"
              placeholder="Letras e números, mínimo 8"
              value={senha}
              onChange={alterarCampo(setSenha)}
              required
            />

            <button
              type="button"
              className="absolute top-1/2 right-[0.7rem] -translate-y-1/2 text-[0.85rem] font-bold text-[#4f7cff] bg-transparent border-0 cursor-pointer"
              onClick={() => setMostrarSenha(!mostrarSenha)}
            >
              {mostrarSenha ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>

          <label htmlFor="confirmacao">Confirmar senha</label>
          <input
            id="confirmacao"
            type={mostrarSenha ? 'text' : 'password'}
            className="w-full p-3 mb-[0.7rem] text-[#e8ecf4] bg-[#1d2230] border border-[#2a3142] rounded-lg"
            placeholder="Repita a senha"
            value={confirmacao}
            onChange={alterarCampo(setConfirmacao)}
            required
          />

          {erro && <p className="my-[0.3rem] text-[0.9rem] text-[#ff7777]">{erro}</p>}

          <button
            className="p-[0.8rem] mt-[0.8rem] font-bold text-white bg-[#4f7cff] border-0 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={carregando}
          >
            {carregando ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <p className="mt-[1.4rem] mb-0 text-center text-[0.9rem] text-[#a0a8bd]">
          Já tem conta?{' '}
          <Link className="font-bold text-[#4f7cff]" to="/login">
            Entrar
          </Link>
        </p>
      </section>
    </main>
  )
}

export default Cadastro
