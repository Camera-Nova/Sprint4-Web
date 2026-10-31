
const Lixeira = ({
  aberta,
  itens = [],
  onFechar,
  onRestaurar,
  onExcluirDefinitivamente,
  onLimparLixeira,
}) => {
  if (!aberta) return null

  const formatarData = (data) => {
    return new Date(data).toLocaleString('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
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
            <h2 className="m-0 text-[1.5em] font-bold">Itens excluídos</h2>
            <p className="mt-[0.4rem] mb-4 text-[#a0a8bd]">
              Restaure documentos removidos ou exclua-os permanentemente.
            </p>
          </div>

          <button className="px-[0.7rem] py-2 text-[#e8ecf4] bg-transparent border border-[#2a3142] rounded-lg cursor-pointer" onClick={onFechar}>
            Fechar
          </button>
        </div>

        {itens.length === 0 ? (
          <p className="p-8 my-4 text-center text-[#a0a8bd] border border-dashed border-[#2a3142] rounded-xl">A lixeira está vazia.</p>
        ) : (
          <>
            <ul className="p-0 my-4 list-none">
              {itens.map((item) => (
                <li className="flex flex-wrap items-start gap-4 p-4 mb-[0.7rem] bg-[#161a22] border border-[#2a3142] rounded-xl sm:flex-nowrap sm:items-center" key={item.id}>
                  {item.imagem && (
                    <img
                      className="w-[84px] h-16 object-cover border border-[#2a3142] rounded-lg"
                      src={item.imagem}
                      alt={`Documento excluído: ${item.nome}`}
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <strong className="block">{item.nome}</strong>
                    <span className="block mt-[0.3rem] text-[0.85rem] text-[#a0a8bd]">{item.tipo}</span>
                    <span className="block mt-[0.3rem] text-[0.85rem] text-[#a0a8bd]">
                      Excluído em: {formatarData(item.excluidoEm)}
                    </span>
                  </div>

                  <div className="flex flex-wrap justify-start w-full gap-2 sm:justify-end sm:w-auto">
                    <button
                      className="px-[0.7rem] py-[0.55rem] text-[#e8ecf4] bg-[#1d2230] border border-[#2a3142] rounded-lg cursor-pointer"
                      onClick={() => onRestaurar(item.id)}
                    >
                      Restaurar
                    </button>

                    <button
                      className="px-[0.7rem] py-[0.55rem] text-[#e8ecf4] bg-[#1d2230] border border-[#2a3142] rounded-lg cursor-pointer hover:bg-[#b93838]"
                      onClick={() => onExcluirDefinitivamente(item.id)}
                    >
                      Excluir permanentemente
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex flex-col items-start gap-[0.8rem] mt-4 sm:flex-row sm:items-stretch sm:justify-end">
              <button
                className="px-[0.7rem] py-[0.55rem] text-[#e8ecf4] bg-[#1d2230] border border-[#2a3142] rounded-lg cursor-pointer w-full hover:bg-[#b93838] sm:w-auto"
                onClick={onLimparLixeira}
              >
                Limpar lixeira
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  )
}

export default Lixeira