import { spawn, spawnSync } from 'node:child_process'
import { copyFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..')
const pastaBackend = join(raiz, 'backend')
const pastaFrontend = join(raiz, 'frontend')
const windows = process.platform === 'win32'

const pythonVenv = windows
  ? join(pastaBackend, '.venv', 'Scripts', 'python.exe')
  : join(pastaBackend, '.venv', 'bin', 'python')

const cores = {
  backend: '\x1b[35m',
  frontend: '\x1b[36m',
  dev: '\x1b[33m',
}

const registrar = (nome, mensagem) => {
  console.log(`${cores[nome]}[${nome}]\x1b[0m ${mensagem}`)
}

const executar = (comando, argumentos, pasta) => {
  const resultado = spawnSync(comando, argumentos, {
    cwd: pasta,
    stdio: 'inherit',
    shell: windows && comando === 'npm',
  })

  return resultado.status === 0
}

const encontrarPython = () => {
  const candidatos = windows ? ['py', 'python', 'python3'] : ['python3', 'python']

  return candidatos.find((candidato) => {
    const resultado = spawnSync(candidato, ['--version'], { stdio: 'ignore' })
    return resultado.status === 0
  })
}

const prepararBackend = () => {
  if (existsSync(pythonVenv)) return

  const python = encontrarPython()

  if (!python) {
    registrar('dev', 'Python não encontrado. Instale o Python 3.11+ e tente novamente.')
    process.exit(1)
  }

  registrar('dev', 'Criando ambiente virtual do backend...')

  const preparado =
    executar(python, ['-m', 'venv', '.venv'], pastaBackend) &&
    executar(pythonVenv, ['-m', 'pip', 'install', '-r', 'requirements.txt'], pastaBackend)

  if (!preparado) {
    registrar('dev', 'Não foi possível preparar o backend.')
    process.exit(1)
  }
}

const prepararFrontend = () => {
  const arquivoEnv = join(pastaFrontend, '.env')

  if (!existsSync(arquivoEnv)) {
    copyFileSync(join(pastaFrontend, '.env.example'), arquivoEnv)
    registrar('dev', 'Arquivo frontend/.env criado a partir do .env.example.')
  }

  if (existsSync(join(pastaFrontend, 'node_modules'))) return

  registrar('dev', 'Instalando dependências do frontend...')

  if (!executar('npm', ['install'], pastaFrontend)) {
    registrar('dev', 'Não foi possível instalar as dependências do frontend.')
    process.exit(1)
  }
}

const processos = []
let encerrando = false

const encerrar = (codigo = 0) => {
  if (encerrando) return
  encerrando = true

  processos.forEach((processo) => {
    if (processo.exitCode === null) processo.kill()
  })

  process.exit(codigo)
}

const iniciar = (nome, comando, argumentos, pasta) => {
  const processo = spawn(comando, argumentos, {
    cwd: pasta,
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: windows && comando === 'npm',
    env: { ...process.env, FORCE_COLOR: '1' },
  })

  const repassar = (dados) => {
    dados
      .toString()
      .split(/\r?\n/)
      .filter((linha) => linha.trim())
      .forEach((linha) => registrar(nome, linha))
  }

  processo.stdout.on('data', repassar)
  processo.stderr.on('data', repassar)

  processo.on('exit', (codigo) => {
    if (encerrando) return
    registrar(nome, `Processo encerrado (código ${codigo}).`)
    encerrar(codigo ?? 1)
  })

  processos.push(processo)
}

prepararBackend()
prepararFrontend()

iniciar('backend', pythonVenv, ['-m', 'uvicorn', 'main:app', '--reload'], pastaBackend)
iniciar('frontend', 'npm', ['run', 'dev'], pastaFrontend)

process.on('SIGINT', () => encerrar(0))
process.on('SIGTERM', () => encerrar(0))
