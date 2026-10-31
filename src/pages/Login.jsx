import {useState} from 'react'

const USUARIOS = [
  {
    nome: 'Administrador',
    email: 'admin@jovi.com',
    senha: 'Admin123',
  },
]

const Login = ({ onEntrar }) => {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [lembrar, setLembrar] = useState(false)
  const [erro, setErro] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)

  const validarLogin = (evento) => {
    evento.preventDefault()

    const emailNormalizado = email.trim().toLowerCase()
    const senhaNormalizada = senha.trim()

    const usuarioEncontrado = USUARIOS.find(
      (usuario) =>
        usuario.email === emailNormalizado &&
        usuario.senha === senhaNormalizada
    )

    if (!usuarioEncontrado) {
      setErro('E-mail ou senha inválidos.')
      return
    }

    setErro('')

    onEntrar(
      {
        nome: usuarioEncontrado.nome,
        email: usuarioEncontrado.email,
        entrouEm: new Date().toISOString(),
      },
      lembrar
    )
  }

  return (
    <main className="grid min-h-screen p-6 font-[Arial,Helvetica,sans-serif] text-[#e8ecf4] bg-linear-135 from-[#0f1115] to-[#1a1f2e] place-items-center">
      <section className="w-full max-w-[420px] p-8 bg-[#161a22] border border-[#2a3142] rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
        <div className="mb-8 text-[2rem] font-extrabold text-center">
          JOVI<span className="text-[#4f7cff]">Scan</span>
        </div>

        <h1 className="mt-[0.67em] mb-[0.4rem] text-[2em] font-bold">Acessar conta</h1>
        <p className="mt-0 mb-6 text-[#a0a8bd]">Entre para acessar suas digitalizações.</p>

        <form className="grid gap-[0.6rem]" onSubmit={validarLogin}>
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            className="w-full p-3 text-[#e8ecf4] bg-[#1d2230] border border-[#2a3142] rounded-lg"
            placeholder="admin@jovi.com"
            value={email}
            onChange={(evento) => {
              setEmail(evento.target.value)
              setErro('')
            }}
            required
          />

          <label htmlFor="senha">Senha</label>

          <div className="relative mb-[0.7rem]">
            <input
              id="senha"
              type={mostrarSenha ? 'text' : 'password'}
              className="w-full p-3 text-[#e8ecf4] bg-[#1d2230] border border-[#2a3142] rounded-lg pr-[5.5rem]"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(evento) => {
                setSenha(evento.target.value)
                setErro('')
              }}
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

          <label className="flex items-center gap-2 text-[0.9rem] text-[#a0a8bd]">
            <input
              type="checkbox"
              checked={lembrar}
              onChange={(evento) => setLembrar(evento.target.checked)}
            />
            Lembrar-me neste dispositivo
          </label>

          {erro && <p className="my-[0.3rem] text-[0.9rem] text-[#ff7777]">{erro}</p>}

          <button
            className="p-[0.8rem] mt-[0.8rem] font-bold text-white bg-[#4f7cff] border-0 rounded-lg cursor-pointer"
            type="submit"
          >
            Entrar
          </button>
        </form>

        <small className="block mt-[1.4rem] text-center text-[#a0a8bd]">
          Teste: <strong>admin@jovi.com</strong> / <strong>Admin123</strong>
        </small>
      </section>
    </main>
  )
}

export default Login
