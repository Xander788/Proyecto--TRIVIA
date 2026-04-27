import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../Components/Card'
import Button from '../Components/Button'
import CustomSelect from '../Components/Select' 

const Selection = () => {
  const [category, setCategory] = useState('general_knowledge')
  const [difficulty, setDifficulty] = useState('easy')
  const [gameMode, setGameMode] = useState('trivia')
  const navigate = useNavigate()

  const startGame = () => {
    if (gameMode === 'trivia') {
      navigate('/game-trivia', { state: { category, difficulty } })
    } else {
      navigate('/game-pokemon', { state: { difficulty } })
    }
  }

  const categories = [
    { value: 'general_knowledge', label: 'Conocimiento General' },
    { value: 'film_and_tv',       label: 'Películas y TV' },
    { value: 'science',           label: 'Ciencia y Naturaleza' },
    { value: 'geography',         label: 'Geografía' },
    { value: 'history',           label: 'Historia' },
  ]

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8">
          <Card className="p-5">
            <h2 className="text-center mb-5 text-white">⚙️ Configura tu partida</h2>

            <CustomSelect
              label="Categoría"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={categories}
            />

            <div className="mb-4">
              <label className="form-label fw-bold text-white">Dificultad</label>
              <div className="btn-group w-100">
                {[
                  { value: 'easy',   label: '🟢 Fácil',  variant: 'success' },
                  { value: 'medium', label: '🟡 Medio',  variant: 'warning' },
                  { value: 'hard',   label: '🔴 Difícil', variant: 'primary' }
                ].map(({ value, label, variant }) => (
                  <Button
                    key={value}
                    variant={difficulty === value ? variant : `outline-${variant}`}
                    className={`flex-grow-1 ${difficulty === value ? 'fw-bold' : ''}`}
                    onClick={() => setDifficulty(value)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="form-label fw-bold text-white">Modo de juego</label>
              <div className="btn-group w-100">
                <Button
                  variant={gameMode === 'trivia' ? 'primary' : 'outline-primary'}
                  className="flex-grow-1"
                  onClick={() => setGameMode('trivia')}
                >
                  🧠 Trivia Normal
                </Button>
                <Button
                  variant={gameMode === 'pokemon' ? 'danger' : 'outline-danger'}
                  className="flex-grow-1"
                  onClick={() => setGameMode('pokemon')}
                >
                  🎮 ¿Quién es ese Pokémon?
                </Button>
              </div>
            </div>

            <Button
              variant="success"
              size="lg"
              className="w-100 py-3 fs-5 fw-bold btn-neon"
              onClick={startGame}
            >
              ¡EMPEZAR {gameMode === 'pokemon' ? 'POKÉMON' : 'TRIVIA'}!
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Selection