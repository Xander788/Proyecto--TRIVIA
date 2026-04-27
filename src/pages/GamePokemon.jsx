import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Card from '../Components/Card'
import Timer from '../Components/Timer'
import Button from '../Components/Button'
import Confetti from '../Components/Confetti'

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
    const initialTime = difficulty === 'easy' ? 25 : difficulty === 'medium' ? 20 : 15
    setTimeLeft(initialTime)
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
        setTimeLeft(difficulty === 'hard' ? 12 : 15)
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
      const newTime = difficulty === 'easy' ? 25 : difficulty === 'medium' ? 20 : 15
      setTimeLeft(newTime)
      fetchPokemon()
    }, 1800)
  }

  return (
    <div className="container py-5">
      <Card className="p-4 mx-auto" style={{ maxWidth: '760px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0 text-white">¿Quién es ese Pokémon? ({pokemonRound}/10)</h5>
          <div className="badge bg-primary fs-5 px-3 py-2">Puntuación: {score}</div>
          <Timer timeLeft={timeLeft} />
        </div>

        {pokemonData && pokemonOptions.length > 0 ? (
          <div className="text-center">
            <h4 className="mb-4 text-white">¿Quién es este Pokémon?</h4>
            <div className="mb-4">
              <img src={pokemonData.sprite} alt="Pokémon" style={{ maxHeight: '260px', imageRendering: 'pixelated' }} />
            </div>
            <div className="d-grid gap-3">
              {pokemonOptions.map((option, i) => (
                <Button
                  key={i}
                  variant={selectedAnswer ? (option === pokemonData.name ? "success" : option === selectedAnswer ? "danger" : "outline-light") : "outline-light"}
                  className="py-3 fs-5"
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
            <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} />
            <p className="text-white fs-5">Cargando siguiente Pokémon...</p>
          </div>
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

export default GamePokemon