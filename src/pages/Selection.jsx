import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../Components/Card'
import Button from '../Components/Button'
import CustomSelect from '../Components/Select'

const Selection = () => {
  const [category, setCategory] = useState(9)
  const [difficulty, setDifficulty] = useState('easy')
  const navigate = useNavigate()

  const startGame = () => {
    navigate('/game', { state: { category, difficulty } })
  }

  const categories = [
    { value: 9,  label: 'Conocimiento General' },
    { value: 11, label: 'Películas' },
    { value: 17, label: 'Ciencia y Naturaleza' },
    { value: 22, label: 'Geografía' },
    { value: 23, label: 'Historia' },
  ]

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8">
          <Card className="p-5">
            <h2 className="text-center mb-5 text-white">Configura tu partida</h2>

            <CustomSelect
              value={category}
              onChange={(e) => setCategory(Number(e.target.value))}
              options={categories}
            />

            <div className="mb-5">
              <label className="form-label fw-bold text-white">Dificultad</label>
              <div className="btn-group w-100">
                {[
                  { value: 'easy',   label: 'Fácil',   variant: 'success' },
                  { value: 'medium', label: 'Medio',   variant: 'warning' },
                  { value: 'hard',   label: 'Difícil', variant: 'primary' }
                ].map(({ value, label, variant }) => (
                  <Button
                    key={value}
                    variant={difficulty === value ? variant : `outline-${variant}`}
                    className={`flex-grow-1 ${difficulty === value ? 'fw-bold shadow-sm' : ''}`}
                    onClick={() => setDifficulty(value)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            <Button 
              variant="success" 
              size="lg" 
              className="w-100 py-3 fs-5 fw-bold"
              onClick={startGame}
            >
              ¡EMPEZAR TRIVIA!
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Selection