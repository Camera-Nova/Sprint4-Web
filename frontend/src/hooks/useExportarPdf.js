import { jsPDF } from 'jspdf'

const useExportarPdf = () => {
  const gerarPdf = (documentos) => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    documentos.forEach((documento, indice) => {
      if (indice > 0) {
        pdf.addPage()
      }

      const larguraPagina = 210
      const alturaPagina = 297
      const margem = 20
      const larguraMaxima = larguraPagina - margem * 2
      const alturaMaxima = 205

      const propriedadesImagem = pdf.getImageProperties(documento.imagem)
      const proporcao = propriedadesImagem.width / propriedadesImagem.height

      let larguraImagem = larguraMaxima
      let alturaImagem = larguraImagem / proporcao

      if (alturaImagem > alturaMaxima) {
        alturaImagem = alturaMaxima
        larguraImagem = alturaImagem * proporcao
      }

      const posicaoX = (larguraPagina - larguraImagem) / 2
      const posicaoY = 48

      pdf.setFontSize(18)
      pdf.text('JOVI Scan - Digitalização', margem, 20)

      pdf.setFontSize(13)
      pdf.text(documento.nome, margem, 30)

      pdf.setFontSize(10)
      pdf.text(`Tipo: ${documento.tipo}`, margem, 37)

      const visibilidade =
        documento.visibilidade === 'publico' ? 'Público' : 'Privado'

      pdf.text(`Privacidade: ${visibilidade}`, margem, 42)

      pdf.addImage(
        documento.imagem,
        'JPEG',
        posicaoX,
        posicaoY,
        larguraImagem,
        alturaImagem
      )

      pdf.setFontSize(8)
      pdf.text(
        `Página ${indice + 1} de ${documentos.length}`,
        margem,
        alturaPagina - 14
      )
    })

    pdf.save('digitalizacoes-jovi-scan.pdf')
  }

  return { gerarPdf }
}

export default useExportarPdf
