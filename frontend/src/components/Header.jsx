const Header = ({
  usuario = {},
  totalDigitalizacoes = 0,
  onSair,
  onConfigurarSenha,
}) => {
  const nomeUsuario = usuario.nome || 'Usuário'

  return (
    <header className="flex items-center justify-between px-[8%] py-4 text-[#e8ecf4] bg-[#161a22] border-b border-[#2a3142]">
      <div className="text-2xl font-extrabold">
        JOVI<span className="text-[#4f7cff]">Scan</span>
      </div>

      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div className="hidden text-right sm:block">
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
    </header>
  )
}

export default Header
