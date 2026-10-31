const tipos = [
  {
    tipo: 'Documento',
    sigla: 'DOC',
    descricao: 'Folha A4 ou documento comum',
  },
  {
    tipo: 'RG / CNH',
    sigla: 'ID',
    descricao: 'Frente e verso em uma página',
  },
  {
    tipo: 'Manuscrito',
    sigla: 'OCR',
    descricao: 'Conversão de escrita à mão',
  },
  {
    tipo: 'Tradução',
    sigla: 'TR',
    descricao: 'Texto traduzido sobre a imagem',
  },
]

const ScanActions = ({ onSelecionarTipo }) => {
  return (
    <section className="my-10 text-[#e8ecf4]">
      <h2 className="mt-[0.83em] mb-[0.4rem] text-[1.5em] font-bold">Digitalizar documento</h2>
      <p className="my-4 text-[#a0a8bd]">
        Escolha o tipo de digitalização e utilize a câmera do navegador.
      </p>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-4 mt-[1.2rem]">
        {tipos.map((tipo) => (
          <button
            key={tipo.tipo}
            className="flex flex-col items-center justify-center gap-2 min-h-[185px] p-[1.4rem] text-center text-[#e8ecf4] bg-[#161a22] border border-[#2a3142] rounded-xl cursor-pointer transition-all duration-200 hover:border-[#4f7cff] hover:-translate-y-1"
            onClick={() => onSelecionarTipo(tipo.tipo)}
          >
            <span className="grid w-12 h-12 text-[0.8rem] font-bold text-[#4f7cff] bg-[#1d2230] border border-[#2a3142] rounded-full place-items-center">{tipo.sigla}</span>
            <strong>{tipo.tipo}</strong>
            <small className="text-[#a0a8bd]">{tipo.descricao}</small>
          </button>
        ))}
      </div>
    </section>
  )
}

export default ScanActions