const ModalDocumento = ({ documento, onFechar }) => {
  if (!documento) return null

  return (
    <div className="fixed inset-0 z-200 grid p-4 bg-black/80 place-items-center" onClick={onFechar}>
      <section
        className="flex flex-col w-[min(88vw,540px)] aspect-square p-5 text-[#e8ecf4] bg-[#161a22] border border-[#2a3142] rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.45)]"
        onClick={(evento) => evento.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-[0.7rem]">
          <div>
            <h2 className="m-0 text-[1.5em] font-bold">{documento.nome}</h2>
            <p className="mt-[0.4rem] text-[#a0a8bd]">{documento.tipo}</p>
          </div>

          <button className="px-[0.7rem] py-2 text-[#e8ecf4] bg-transparent border border-[#2a3142] rounded-lg cursor-pointer" onClick={onFechar}>
            Fechar
          </button>
        </div>

        <div className="grid flex-1 min-h-0 overflow-hidden bg-[#0f1115] border border-[#2a3142] rounded-[10px] place-items-center">
          <img
            className="w-full h-full object-contain"
            src={documento.imagem}
            alt={`Documento digitalizado: ${documento.nome}`}
          />
        </div>
      </section>
    </div>
  )
}

export default ModalDocumento