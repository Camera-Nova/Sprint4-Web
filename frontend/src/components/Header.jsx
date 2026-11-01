import { useState } from 'react'

const Header = ({
  usuario = {},
  totalDigitalizacoes = 0,
  onSair,
  onConfigurarSenha,
}) => {
  const [menuAberto, setMenuAberto] = useState(false)
  const nomeUsuario = usuario.nome || 'Usuário'

  const alternarMenu = () => {
    setMenuAberto((aberto) => !aberto)
  }

  const configurarSenha = () => {
    setMenuAberto(false)
    onConfigurarSenha()
  }

  const sair = () => {
    setMenuAberto(false)
    onSair()
  }

  return (
    <header className="relative flex items-center justify-between px-[8%] py-4 text-[#e8ecf4] bg-[#161a22] border-b border-[#2a3142]">
      <div className="text-2xl font-extrabold">
        JOVI<span className="text-[#4f7cff]">Scan</span>
      </div>

      <div className="hidden sm:flex sm:flex-row sm:items-center sm:gap-4">
        <div className="text-right">
          <strong className="block">{nomeUsuario}</strong>
          <span className="block text-[0.8rem] text-[#a0a8bd]">
            {totalDigitalizacoes} digitalização(ões)
          </span>
        </div>

        <button
          className="px-4 py-[0.7rem] text-[#e8ecf4] bg-[#1d2230] border border-[#2a3142] rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onConfigurarSenha}
        >
          Senha privada
        </button>

        <button
          className="px-[0.9rem] py-[0.6rem] text-white bg-[#b93838] border-0 rounded-lg cursor-pointer"
          onClick={onSair}
        >
          Sair
        </button>
      </div>

      <button
        className="flex flex-col justify-center gap-[5px] w-11 h-11 px-[0.7rem] bg-[#1d2230] border border-[#2a3142] rounded-lg cursor-pointer sm:hidden"
        onClick={alternarMenu}
        aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={menuAberto}
      >
        <span className={`block h-0.5 w-full bg-[#e8ecf4] rounded-full transition-transform ${menuAberto ? 'translate-y-[7px] rotate-45' : ''}`} />
        <span className={`block h-0.5 w-full bg-[#e8ecf4] rounded-full transition-opacity ${menuAberto ? 'opacity-0' : ''}`} />
        <span className={`block h-0.5 w-full bg-[#e8ecf4] rounded-full transition-transform ${menuAberto ? '-translate-y-[7px] -rotate-45' : ''}`} />
      </button>

      {menuAberto && (
        <div className="absolute top-full right-0 left-0 z-50 flex flex-col gap-3 px-[8%] py-4 bg-[#161a22] border-b border-[#2a3142] shadow-lg sm:hidden">
          <div>
            <strong className="block">{nomeUsuario}</strong>
            <span className="block text-[0.8rem] text-[#a0a8bd]">
              {totalDigitalizacoes} digitalização(ões)
            </span>
          </div>

          <button
            className="w-full px-4 py-[0.7rem] text-[#e8ecf4] bg-[#1d2230] border border-[#2a3142] rounded-lg cursor-pointer"
            onClick={configurarSenha}
          >
            Senha privada
          </button>

          <button
            className="w-full px-[0.9rem] py-[0.7rem] text-white bg-[#b93838] border-0 rounded-lg cursor-pointer"
            onClick={sair}
          >
            Sair
          </button>
        </div>
      )}
    </header>
  )
}

export default Header
