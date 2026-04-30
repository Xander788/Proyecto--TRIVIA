import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Card from '../Components/Card'
import Timer from '../Components/Timer'
import Button from '../Components/Button'
import Confetti from '../Components/Confetti'

const TIEMPO = { easy: 30, medium: 20, hard: 12 }

const GamePokemon = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const { difficulty = 'easy' } = location.state || {}

  const [pokemonData, setPokemonData] = useState(null)
  const [pokemonOptions, setPokemonOptions] = useState([])
  const [pokemonRound, setPokemonRound] = useState(1)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [timeLeft, setTimeLeft] = useState(25)
  const [loading, setLoading] = useState(true)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const timerRef = useRef(null)
  const fetchIdRef = useRef(0)

  const fetchPokemon = async () => {
    setLoading(true)
    setPokemonData(null)
    setPokemonOptions([])

    const currentFetchId = ++fetchIdRef.current

    try {
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
    } catch (err) {
      alert("Error cargando Pokémon")
      navigate('/selection')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setTimeLeft(TIEMPO[difficulty])
    fetchPokemon()
  }, [])

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (selectedAnswer !== null || loading || pokemonOptions.length === 0) return

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
  }, [selectedAnswer, loading, pokemonOptions.length])

  const handleTimeout = () => {
    if (pokemonData) {
      setSelectedAnswer(pokemonData.name)
      setIsCorrect(false)
      setShowFeedback(true)
      setTimeout(() => {
        setShowFeedback(false)
        setSelectedAnswer(null)
        setPokemonOptions([])
        setPokemonData(null)
        setTimeLeft(TIEMPO[difficulty])
        fetchPokemon()
      }, 1800)
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

      const nextRound = pokemonRound + 1
      if (nextRound > 10) {
        navigate('/results', { state: { score: score + (correct ? 1 : 0), total: 10, gameMode: 'pokemon' } })
        return
      }

      setPokemonRound(nextRound)
      setTimeLeft(TIEMPO[difficulty])
      fetchPokemon()
    }, 1800)
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <Card className="p-5">
          <div className="spinner-border text-success mb-4" role="status" />
          <h4 className="text-white mb-2">Cargando Pokémon...</h4>
          <p className="text-white opacity-75">Conectando con la API de Pokémon</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-2">
      <Confetti active={showConfetti} />

      <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
        <span className="text-white fw-bold fs-5">
          Ronda {pokemonRound} / 10
        </span>
        <Timer timeLeft={timeLeft} />
        <span className="badge bg-success fs-6 px-3 py-2">
          ✅ {score} correctas
        </span>
      </div>

      <div className="progress mb-2 game-progress">
        <div
          className="progress-bar bg-success"
          style={{ width: `${(pokemonRound / 10) * 100}%` }}
        />
      </div>

      <Card className="p-3 p-md-3">
        {pokemonData && pokemonOptions.length > 0 ? (
          <div>
            <h4 className="text-center mb-2 text-white">¿Quién es este Pokémon?</h4>
            <div className="text-center mb-2">
              <img 
                src={pokemonData.sprite} 
                alt="Pokémon" 
                className="pokemon-sprite" 
              />
            </div>
            <div className="d-grid gap-2">
              {pokemonOptions.map((option, i) => (
                <Button
                  key={i}
                  variant={
                    selectedAnswer 
                      ? option === pokemonData.name 
                        ? "success" 
                        : option === selectedAnswer 
                        ? "danger" 
                        : "outline-light"
                      : "outline-light"
                  }
                  className="py-2"
                  onClick={() => handleAnswer(option)}
                  disabled={!!selectedAnswer}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-5">
            <div className="spinner-border text-success mb-3" role="status" />
            <p className="text-white fs-5">Cargando siguiente Pokémon...</p>
          </div>
        )}

        {showFeedback && (
          <div className="mt-2 text-center">
            {isCorrect ? (
              <p className="text-success fw-bold fs-5">🎉 ¡Correcto!</p>
            ) : (
              <p className="text-danger fw-bold fs-5">
                ❌ Incorrecto — era: <strong>{pokemonData?.name}</strong>
              </p>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}

export default GamePokemon