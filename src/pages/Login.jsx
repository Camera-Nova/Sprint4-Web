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
    <main className="pagina-login">
      <section className="card-login">
        <div className="logo logo-login">
          JOVI<span>Scan</span>
        </div>

        <h1>Acessar conta</h1>
        <p>Entre para acessar suas digitalizações.</p>

        <form onSubmit={validarLogin}>
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            placeholder="admin@jovi.com"
            value={email}
            onChange={(evento) => {
              setEmail(evento.target.value)
              setErro('')
            }}
            required
          />

          <label htmlFor="senha">Senha</label>

          <div className="campo-senha">
            <input
              id="senha"
              type={mostrarSenha ? 'text' : 'password'}
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
              className="btn-ver-senha"
              onClick={() => setMostrarSenha(!mostrarSenha)}
            >
              {mostrarSenha ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>

          <label className="lembrar">
            <input
              type="checkbox"
              checked={lembrar}
              onChange={(evento) => setLembrar(evento.target.checked)}
            />
            Lembrar-me neste dispositivo
          </label>

          {erro && <p className="erro-login">{erro}</p>}

          <button className="btn-entrar" type="submit">
            Entrar
          </button>
        </form>

        <small>
          Teste: <strong>admin@jovi.com</strong> / <strong>Admin123</strong>
        </small>
      </section>
    </main>
  )
}

export default Login