import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Card from '../Components/Card'
import Timer from '../Components/Timer'
import Pregunta from '../Components/Pregunta'
import Button from '../Components/Button'

const GameTrivia = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const { category = 9, difficulty = 'easy' } = location.state || {}

  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [timeLeft, setTimeLeft] = useState(25)
  const [loading, setLoading] = useState(true)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const hasFetched = useRef(false)
  const timerRef = useRef(null)

  const fetchQuestions = async () => {
    setLoading(true)
    try {
      const res = await fetch(
        `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`
      )
      const data = await res.json()
      if (data.response_code === 0 && data.results.length > 0) {
        setQuestions(data.results)
        setTimeLeft(difficulty === 'hard' ? 15 : difficulty === 'medium' ? 20 : 25)
      } else {
        alert("No hay suficientes preguntas")
        navigate('/selection')
      }
    } catch (err) {
      alert("Error cargando preguntas")
      navigate('/selection')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuestions()
  }, [])

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (selectedAnswer !== null || loading) return

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          handleNext()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [currentQuestion, selectedAnswer, loading])

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer)
    const correctAnswer = questions[currentQuestion]?.correct_answer
    const correct = answer === correctAnswer
    setIsCorrect(correct)

    if (correct) setScore(score + 1)
    setShowFeedback(true)

    if (timerRef.current) clearInterval(timerRef.current)

    setTimeout(() => {
      setShowFeedback(false)
      setSelectedAnswer(null)
      handleNext()
    }, 1500)
  }

  const handleNext = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1)
      setTimeLeft(difficulty === 'hard' ? 15 : difficulty === 'medium' ? 20 : 25)
    } else {
      navigate('/results', { state: { score, total: questions.length, gameMode: 'trivia' } })
    }
  }

  if (loading || questions.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" />
        <p className="mt-3">Cargando preguntas...</p>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <Card className="p-4 mx-auto" style={{ maxWidth: '760px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0 text-white">Pregunta {currentQuestion + 1} / {questions.length}</h5>
          <div className="badge bg-primary fs-5 px-3 py-2">Puntuación: {score}</div>
          <Timer timeLeft={timeLeft} />
        </div>

        <Pregunta
          pregunta={questions[currentQuestion]?.question}
          respuestas={[
            ...(questions[currentQuestion]?.incorrect_answers || []),
            questions[currentQuestion]?.correct_answer
          ].sort(() => Math.random() - 0.5)}
          respuestaSeleccionada={selectedAnswer}
          onSeleccionar={handleAnswer}
          respuestaCorrecta={questions[currentQuestion]?.correct_answer}
        />

        {showFeedback && (
          <div className={`text-center mt-4 fs-4 fw-bold ${isCorrect ? 'text-success' : 'text-primary'}`}>
            {isCorrect ? '¡Correcto! 🎉' : '¡Incorrecto!'}
          </div>
        )}
      </Card>
    </div>
  )
}

export default GameTrivia