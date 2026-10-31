const Notificacoes = ({ itens = [] }) => {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)

  const avisosVencimento = itens
    .filter((item) => item.validade)
    .map((item) => {
      const dataValidade = new Date(`${item.validade}T23:59:59`)
      const diferencaEmDias = Math.ceil(
        (dataValidade - hoje) / (1000 * 60 * 60 * 24)
      )

      return {
        ...item,
        diferencaEmDias,
      }
    })
    .filter((item) => item.diferencaEmDias <= 30)
    .sort((a, b) => a.diferencaEmDias - b.diferencaEmDias)

  const documentosPublicos = itens.filter(
    (item) => item.visibilidade === 'publico'
  ).length

  const textoVencimento = (aviso) => {
    if (aviso.diferencaEmDias < 0) {
      return `O documento "${aviso.nome}" está vencido.`
    }

    if (aviso.diferencaEmDias === 0) {
      return `O documento "${aviso.nome}" vence hoje.`
    }

    return `O documento "${aviso.nome}" vence em ${aviso.diferencaEmDias} dia(s).`
  }

  return (
    <section className="my-10 text-[#e8ecf4]">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="mt-[0.83em] mb-[0.4rem] text-[1.5em] font-bold">Notificações e privacidade</h2>
          <p className="my-4 text-[#a0a8bd]">
            Acompanhe vencimentos, novidades e documentos públicos.
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        <article className="flex flex-col gap-2 p-4 bg-[#161a22] border border-[#2a3142] border-l-4 rounded-[10px] border-l-[#4f7cff]">
          <strong className="text-[0.95rem]">Novidade</strong>
          <span className="text-[0.9rem] text-[#a0a8bd]">
            Agora você pode definir a privacidade e a data de vencimento dos
            seus documentos.
          </span>
        </article>

        {avisosVencimento.map((aviso) => (
          <article
            className="flex flex-col gap-2 p-4 bg-[#161a22] border border-[#2a3142] border-l-4 rounded-[10px] border-l-[#e0a22f]"
            key={aviso.id}
          >
            <strong className="text-[0.95rem]">Aviso de vencimento</strong>
            <span className="text-[0.9rem] text-[#a0a8bd]">{textoVencimento(aviso)}</span>
          </article>
        ))}

        <article className="flex flex-col gap-2 p-4 bg-[#161a22] border border-[#2a3142] border-l-4 rounded-[10px] border-l-[#8a6cff]">
          <strong className="text-[0.95rem]">Privacidade</strong>
          <span className="text-[0.9rem] text-[#a0a8bd]">
            Você possui {documentosPublicos} documento(s) marcado(s) como
            público(s).
          </span>
        </article>
      </div>
    </section>
  )
}

export default Notificacoes