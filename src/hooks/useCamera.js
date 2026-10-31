import { useEffect, useRef, useState } from 'react'

const useCamera = () => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const iniciarCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        })

        streamRef.current = stream

        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }

        setCarregando(false)
      } catch {
        setErro(
          'Não foi possível acessar a câmera. Verifique a permissão do navegador.'
        )
        setCarregando(false)
      }
    }

    iniciarCamera()

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const capturarImagem = () => {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || !canvas || !video.videoWidth || !video.videoHeight) {
      setErro('A câmera ainda não está pronta. Tente novamente.')
      return null
    }

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const contexto = canvas.getContext('2d')

    contexto.drawImage(
      video,
      0,
      0,
      video.videoWidth,
      video.videoHeight
    )

    return canvas.toDataURL('image/jpeg', 0.85)
  }

  return { videoRef, canvasRef, erro, setErro, carregando, capturarImagem }
}

export default useCamera
