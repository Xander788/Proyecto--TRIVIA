export async function traducirPreguntaTrivia(item) {
  const todasLasRespuestas = [...item.incorrectAnswers, item.correctAnswer]

  const [preguntaTraducida, ...respuestasTraducidas] = await Promise.all([
    traducirTexto(item.question.text),
    ...todasLasRespuestas.map(traducirTexto),
  ])

  const correctaTraducida = respuestasTraducidas[respuestasTraducidas.length - 1]
  const incorrectasTraducidas = respuestasTraducidas.slice(0, -1)

  return {
    pregunta: preguntaTraducida,
    respuestas: mezclar([...incorrectasTraducidas, correctaTraducida]),
    correcta: correctaTraducida,
  }
}

function mezclar(arr) {
  const copia = [...arr]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

async function traducirTexto(texto) {
  if (!texto?.trim()) return texto
  try {
    const respuesta = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(texto)}&langpair=en|es&de=andresthefit17@gmail.com`
    )
    if (!respuesta.ok) return texto
    const datos = await respuesta.json()
    if (datos.responseStatus === 200) return datos.responseData.translatedText.trim()
    return texto
  } catch {
    return texto
  }
}