import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Card from '../Components/Card'
import Button from '../Components/Button'
import Timer from '../Components/Timer'
import Pregunta from '../Components/Pregunta'
import Confetti from '../Components/Confetti'

const BANCO_LOCAL = [
  {
    pregunta: '¿Cuál es el planeta más grande del sistema solar?',
    correcta: 'Júpiter',
    incorrectas: ['Saturno', 'Neptuno', 'Marte'],
  },
  {
    pregunta: '¿En qué año llegó el hombre a la Luna?',
    correcta: '1969',
    incorrectas: ['1972', '1965', '1975'],
  },
  {
    pregunta: '¿Cuál es el símbolo químico del Oro?',
    correcta: 'Au',
    incorrectas: ['Go', 'Or', 'Ag'],
  },
  {
    pregunta: '¿Cuántos continentes tiene la Tierra?',
    correcta: '7',
    incorrectas: ['5', '6', '8'],
  },
  {
    pregunta: '¿Cuál es el océano más grande del mundo?',
    correcta: 'Pacífico',
    incorrectas: ['Atlántico', 'Índico', 'Ártico'],
  },
  {
    pregunta: '¿Quién pintó la Mona Lisa?',
    correcta: 'Leonardo da Vinci',
    incorrectas: ['Miguel Ángel', 'Rafael', 'Picasso'],
  },
  {
    pregunta: '¿Cuál es el país más grande del mundo?',
    correcta: 'Rusia',
    incorrectas: ['China', 'Canadá', 'Estados Unidos'],
  },
  {
    pregunta: '¿Cuántos lados tiene un hexágono?',
    correcta: '6',
    incorrectas: ['5', '7', '8'],
  },
  {
    pregunta: '¿Cuál es el animal terrestre más rápido?',
    correcta: 'Guepardo',
    incorrectas: ['León', 'Caballo', 'Springbok'],
  },
  {
    pregunta: '¿En qué país se originó el fútbol moderno?',
    correcta: 'Inglaterra',
    incorrectas: ['Brasil', 'España', 'Francia'],
  },
  {
    pregunta: '¿Cuál es la capital de Australia?',
    correcta: 'Canberra',
    incorrectas: ['Sídney', 'Melbourne', 'Brisbane'],
  },
  {
    pregunta: '¿Cuántos huesos tiene el cuerpo humano adulto?',
    correcta: '206',
    incorrectas: ['198', '213', '220'],
  },
]

const mezclar = (arr) => {
  const copia = [...arr]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

const fetchDeAPI = async (category, difficulty) => {
  const categoriaAPI = {
    general_knowledge: 'general_knowledge',
    film_and_tv: 'film_and_tv',
    science: 'science',
    geography: 'geography',
    history: 'history',
  }[category] || 'general_knowledge'
 
  const url = `https://the-trivia-api.com/v2/questions?categories=${categoriaAPI}&difficulty=${difficulty}&limit=10`
  const respuesta = await fetch(url)
 
  if (!respuesta.ok) throw new Error(`Error de API: ${respuesta.status}`)
 
  const data = await respuesta.json()
  if (!data || data.length === 0) throw new Error('La API no devolvió preguntas')
 
  return data.map((item) => ({
    pregunta: item.question.text,
    respuestas: mezclar([...item.incorrectAnswers, item.correctAnswer]),
    correcta: item.correctAnswer,
  }))
}

const getPreguntasLocales = () => {
  return mezclar(BANCO_LOCAL)
    .slice(0, 10)
    .map((item) => ({
      pregunta: item.pregunta,
      respuestas: mezclar([...item.incorrectas, item.correcta]),
      correcta: item.correcta,
    }))
}

const TIEMPO = { easy: 30, medium: 20, hard: 12 }

const GameTrivia = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const { category = 'general_knowledge', difficulty = 'easy' } = location.state || {}

  const [preguntas, setPreguntas] = useState([])
  const [indice, setIndice] = useState(0)
  const [respuestaElegida, setRespuestaElegida] = useState(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIEMPO[difficulty])
  const [cargando, setCargando] = useState(true)
  const [usoFallback, setUsoFallback] = useState(false)
  const [confetti, setConfetti] = useState(false)
 
  const scoreRef = useRef(0)
  const timerRef = useRef(null)

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await fetchDeAPI(category, difficulty)
        setPreguntas(data)
        setUsoFallback(false)
      } catch (err) {
        console.warn('API falló, usando banco local:', err.message)
        setPreguntas(getPreguntasLocales())
        setUsoFallback(true)
      }
      setCargando(false)
    }
    cargar()
  }, []) 
 
  useEffect(() => {
    if (cargando || respuestaElegida !== null) return

    setTimeLeft(TIEMPO[difficulty])
 
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          setRespuestaElegida('__tiempo_agotado__')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [indice, cargando, respuestaElegida])
 
  const handleSeleccionar = (respuesta) => {
    clearInterval(timerRef.current)
    setRespuestaElegida(respuesta)
 
    const esCorrecta = respuesta === preguntas[indice]?.correcta
 
    if (esCorrecta) {
      scoreRef.current = scoreRef.current + 1
      setScore(scoreRef.current)
      setConfetti(true)
      setTimeout(() => setConfetti(false), 2500)
    }
  }

  const handleSiguiente = () => {
    const esUltima = indice >= preguntas.length - 1
 
    if (esUltima) {
      navigate('/results', {
        state: {
          score: scoreRef.current,
          total: preguntas.length,
          gameMode: 'trivia',
        },
      })
    } else {
      setIndice((prev) => prev + 1)
      setRespuestaElegida(null)
    }
  }

  if (cargando) {
    return (
      <div className="container py-5 text-center">
        <Card className="p-5">
          <div className="spinner-border text-success mb-4" role="status" />
          <h4 className="text-white mb-2">Cargando preguntas...</h4>
          <p className="text-white opacity-75">Conectando con la API de trivia</p>
        </Card>
      </div>
    )
  }
 
  const preguntaActual = preguntas[indice]
  if (!preguntaActual) return null
 
  return (
    <div className="container py-4">
      <Confetti active={confetti} />
      {usoFallback && (
        <div className="alert alert-warning text-center mb-3">
          ⚠️ La API no respondió — usando preguntas locales
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <span className="text-white fw-bold fs-5">
          Pregunta {indice + 1} / {preguntas.length}
        </span>
        <Timer timeLeft={timeLeft} />
        <span className="badge bg-success fs-6 px-3 py-2">
          ✅ {score} correctas
        </span>
      </div>

      <div className="progress mb-4" style={{ height: '8px' }}>
        <div
          className="progress-bar bg-success"
          style={{ width: `${((indice + 1) / preguntas.length) * 100}%` }}
        />
      </div>

      <Card className="p-4 p-md-5">
        <Pregunta
          pregunta={preguntaActual.pregunta}
          respuestas={preguntaActual.respuestas}
          respuestaSeleccionada={respuestaElegida}
          onSeleccionar={handleSeleccionar}
          respuestaCorrecta={preguntaActual.correcta}
        />
        {respuestaElegida && (
          <div className="mt-4 text-center">
            {respuestaElegida === preguntaActual.correcta ? (
              <p className="text-success fw-bold fs-5">🎉 ¡Correcto!</p>
            ) : respuestaElegida === '__tiempo_agotado__' ? (
              <p className="text-warning fw-bold fs-5">
                ⏰ Tiempo agotado — la correcta era: <strong>{preguntaActual.correcta}</strong>
              </p>
            ) : (
              <p className="text-danger fw-bold fs-5">
                ❌ Incorrecto — la correcta era: <strong>{preguntaActual.correcta}</strong>
              </p>
            )}
 
            <Button
              variant="success"
              size="lg"
              className="mt-2 px-5 fw-bold btn-neon"
              onClick={handleSiguiente}
            >
              {indice >= preguntas.length - 1 ? '🏁 Ver Resultados' : 'Siguiente →'}
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
 
export default GameTrivia