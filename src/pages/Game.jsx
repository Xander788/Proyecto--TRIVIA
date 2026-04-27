import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Card from '../Components/Card'
import Timer from '../Components/Timer'
import Pregunta from '../Components/Pregunta'
import Confetti from '../Components/Confetti'
import Button from '../Components/Button'

const Game = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const { category = 9, difficulty = 'easy', gameMode = 'trivia' } = location.state || {}
  const isPokemonMode = gameMode === 'pokemon'

  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [timeLeft, setTimeLeft] = useState(25)
  const [loading, setLoading] = useState(true)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const [pokemonData, setPokemonData] = useState(null)
  const [pokemonOptions, setPokemonOptions] = useState([])
  const [pokemonRound, setPokemonRound] = useState(1)

  const hasFetched = useRef(false)
  const timerRef = useRef(null)
  const fetchIdRef = useRef(0)

  const fetchData = async () => {
    setLoading(true)
    setPokemonData(null)
    setPokemonOptions([])

    const currentFetchId = ++fetchIdRef.current

    try {
      if (isPokemonMode) {
        let maxId = 151
        if (difficulty === 'medium') maxId = 251
        if (difficulty === 'hard') maxId = 649

        const randomId = Math.floor(Math.random() * maxId) + 1

        const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
        const pokemon = await pokemonRes.json()

        const speciesRes = await fetch(pokemon.species.url)
        const species = await speciesRes.json()
        const spanishName = species.names.find(n => n.language.name === 'es').name

        const wrongOptions = []
        while (wrongOptions.length < 3) {
          const wrongId = Math.floor(Math.random() * maxId) + 1
          if (wrongId !== randomId) {
            const wRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${wrongId}`)
            const wPoke = await wRes.json()
            const wSpeciesRes = await fetch(wPoke.species.url)
            const wSpecies = await wSpeciesRes.json()
            const wName = wSpecies.names.find(n => n.language.name === 'es').name
            if (!wrongOptions.includes(wName)) wrongOptions.push(wName)
          }
        }

        const allOptions = [spanishName, ...wrongOptions].sort(() => Math.random() - 0.5)

        if (currentFetchId === fetchIdRef.current) {
          setPokemonData({
            name: spanishName,
            sprite: pokemon.sprites.other['official-artwork'].front_default
          })
          setPokemonOptions(allOptions)
        }

      } else {
        if (hasFetched.current) return
        hasFetched.current = true

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
      }
    } catch (err) {
      console.error("Error en fetchData:", err)
      alert("Error cargando datos. Intenta de nuevo.")
      navigate('/selection')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isPokemonMode) {
      const initialTime = difficulty === 'easy' ? 25 : difficulty === 'medium' ? 20 : 15
      setTimeLeft(initialTime)
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current)

    if (selectedAnswer !== null || loading || (isPokemonMode && pokemonOptions.length === 0)) {
      return
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          handleTimeout()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [currentQuestion, selectedAnswer, loading, pokemonOptions.length, isPokemonMode])

  const handleTimeout = () => {
    if (isPokemonMode && pokemonData) {
      setSelectedAnswer(pokemonData.name)
      setIsCorrect(false)
      setShowFeedback(true)
      setTimeout(() => {
        setShowFeedback(false)
        setSelectedAnswer(null)
        setPokemonOptions([])
        setPokemonData(null)
        setTimeLeft(difficulty === 'hard' ? 12 : 15)
        fetchData()
      }, 1800)
    } else {
      handleNext()
    }
  }

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer)

    const correct = answer === pokemonData?.name
    setIsCorrect(correct)

    if (correct) {
      setScore(score + 1)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 2500)
    }

    setShowFeedback(true)

    if (timerRef.current) clearInterval(timerRef.current)

    setTimeout(() => {
      setShowFeedback(false)
      setSelectedAnswer(null)
      setPokemonOptions([])
      setPokemonData(null)

      if (isPokemonMode) {
        const nextRound = pokemonRound + 1

        if (nextRound > 10) {
          navigate('/results', {
            state: { score: score + (correct ? 1 : 0), total: 10, gameMode }
          })
          return
        }

        setPokemonRound(nextRound)
        const newTime = difficulty === 'easy' ? 25 : difficulty === 'medium' ? 20 : 15
        setTimeLeft(newTime)
        fetchData()
      } else {
        handleNext()
      }
    }, 1800)
  }

  const handleNext = () => {
    if (!isPokemonMode) {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setTimeLeft(difficulty === 'hard' ? 15 : difficulty === 'medium' ? 20 : 25)
      } else {
        navigate('/results', { state: { score, total: questions.length, gameMode } })
      }
    }
  }

  return (
    <div className="container py-5">
      <Card className="p-4 mx-auto" style={{ maxWidth: '760px' }}>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0 text-white">
            {isPokemonMode
              ? `¿Quién es ese Pokémon? (${pokemonRound}/10)`
              : `Pregunta ${currentQuestion + 1} / ${questions.length}`
            }
          </h5>
          <div className="text-end">
            <div className="badge bg-primary fs-5 px-3 py-2">
              Puntuación: <strong>{score}</strong>
            </div>
          </div>
          <Timer timeLeft={timeLeft} />
        </div>

        {isPokemonMode && pokemonData && pokemonOptions.length > 0 ? (
          <div className="text-center">
            <h4 className="mb-4 text-white">¿Quién es este Pokémon?</h4>

            <div className="mb-4">
              <img
                src={pokemonData.sprite}
                alt="Pokémon"
                style={{ maxHeight: '260px', imageRendering: 'pixelated' }}
              />
            </div>

            <div className="d-grid gap-3">
              {pokemonOptions.map((option, i) => (
                <Button
                  key={i}
                  variant={
                    selectedAnswer
                      ? (option === pokemonData.name ? "success" : option === selectedAnswer ? "danger" : "outline-light")
                      : "outline-light"
                  }
                  className="py-3 fs-5"
                  onClick={() => handleAnswer(option)}
                  disabled={!!selectedAnswer}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        ) : isPokemonMode ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} />
            <p className="text-white fs-5">Cargando siguiente Pokémon...</p>
          </div>
        ) : (
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
        )}

        {showFeedback && (
          <div className={`text-center mt-4 fs-4 fw-bold ${isCorrect ? 'text-success' : 'text-primary'}`}>
            {isCorrect ? '¡Correcto! 🎉' : '¡Incorrecto!'}
          </div>
        )}
      </Card>

      <Confetti active={showConfetti} />
    </div>
  )
}

export default Game