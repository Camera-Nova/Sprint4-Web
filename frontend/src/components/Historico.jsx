const Historico = ({
  itens = [],
  quantidadeLixeira = 0,
  onRemover = () => {},
  onLimpar = () => {},
  onVisualizar = () => {},
  onEditar = () => {},
  onExportarPdf = () => {},
  onAbrirLixeira = () => {},
}) => {
  const formatarData = (data) => {
    return new Date(data).toLocaleString('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    })
  }

  const formatarValidade = (validade) => {
    if (!validade) return 'Sem vencimento'

    return new Date(`${validade}T12:00:00`).toLocaleDateString('pt-BR')
  }

  const classesPorVisibilidade = {
    publico: 'text-[#94e4ad] bg-[rgba(74,222,128,0.12)]',
    privado: 'text-[#b9a9ff] bg-[rgba(138,108,255,0.14)]',
  }

  return (
    <section className="my-10 text-[#e8ecf4]">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="mt-[0.83em] mb-[0.4rem] text-[1.5em] font-bold">Histórico de digitalizações</h2>
          <p className="my-4 text-[#a0a8bd]">
            As digitalizações são salvas no navegador.
          </p>
        </div>

        <div className="flex flex-wrap w-full gap-[0.6rem] sm:w-auto">
          <button className="px-4 py-[0.7rem] text-[#e8ecf4] bg-[#1d2230] border border-[#2a3142] rounded-lg cursor-pointer flex-1 sm:flex-none disabled:opacity-50 disabled:cursor-not-allowed" onClick={onAbrirLixeira}>
            Itens excluídos ({quantidadeLixeira})
          </button>

          <button
            className="px-4 py-[0.7rem] text-[#e8ecf4] bg-[#1d2230] border border-[#2a3142] rounded-lg cursor-pointer flex-1 sm:flex-none disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onExportarPdf}
            disabled={itens.length === 0}
          >
            Exportar PDF
          </button>

          <button
            className="px-4 py-[0.7rem] text-[#e8ecf4] bg-[#1d2230] border border-[#2a3142] rounded-lg cursor-pointer flex-1 sm:flex-none disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onLimpar}
            disabled={itens.length === 0}
          >
            Limpar tudo
          </button>
        </div>
      </div>

      {itens.length === 0 ? (
        <p className="p-8 my-4 text-center text-[#a0a8bd] border border-dashed border-[#2a3142] rounded-xl">
          Nenhuma digitalização ainda. Escolha uma opção acima para começar.
        </p>
      ) : (
        <ul className="p-0 my-4 list-none">
          {itens.map((item) => {
            const visibilidade = item.visibilidade || 'privado'

            return (
              <li className="flex flex-wrap items-start gap-4 p-4 mb-[0.7rem] bg-[#161a22] border border-[#2a3142] rounded-xl sm:flex-nowrap sm:items-center" key={item.id}>
                {item.imagem ? (
                  <img
                    className="w-[84px] h-16 object-cover border border-[#2a3142] rounded-lg"
                    src={item.imagem}
                    alt={`Digitalização ${item.nome}`}
                  />
                ) : (
                  <div className="grid w-[84px] h-16 text-xs font-bold text-[#b9a9ff] bg-[#1d2230] border border-[#2a3142] rounded-lg place-items-center">
                    Privado
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <strong className="block">{item.nome}</strong>

                  <span className="block mt-[0.3rem] text-[0.85rem] text-[#a0a8bd]">
                    {item.tipo} · {formatarData(item.data)} · Qualidade:{' '}
                    {item.qualidade}%
                  </span>

                  <span className="block mt-[0.3rem] text-[0.85rem] text-[#a0a8bd]">
                    Vencimento: {formatarValidade(item.validade)}
                  </span>

                  <span
                    className={`block w-fit px-2 py-1 mt-[0.3rem] text-xs font-bold rounded-full ${classesPorVisibilidade[visibilidade]}`}
                  >
                    {visibilidade === 'publico'
                      ? 'Documento público'
                      : 'Documento privado'}
                  </span>
                </div>

                <div className="flex flex-wrap justify-start w-full gap-2 sm:justify-end sm:w-auto">
                  <button
                    className="px-[0.7rem] py-[0.55rem] text-[#e8ecf4] bg-[#1d2230] border border-[#2a3142] rounded-lg cursor-pointer"
                    onClick={() => onVisualizar(item)}
                  >
                    Visualizar
                  </button>

                  <button
                    className="px-[0.7rem] py-[0.55rem] text-[#e8ecf4] bg-[#1d2230] border border-[#2a3142] rounded-lg cursor-pointer"
                    onClick={() => onEditar(item)}
                  >
                    Editar
                  </button>

                  <button
                    className="px-[0.7rem] py-[0.55rem] text-[#e8ecf4] bg-[#1d2230] border border-[#2a3142] rounded-lg cursor-pointer hover:bg-[#b93838]"
                    onClick={() => onRemover(item.id)}
                  >
                    Excluir
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export default Historico