import { useNavigate } from 'react-router-dom'
import Card from '../Components/Card'
import Button from '../Components/Button'

const Home = () => {
  const navigate = useNavigate()

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-7 col-md-9">
          <Card className="p-5 text-center">
            <h1 className="display-3 fw-bold neon-text mb-3 text-white">
              🧠 Trivia
            </h1>
            
            <p className="lead fs-4 text-white mb-5">
              Pon a prueba tus conocimientos con preguntas reales
            </p>

            <div className="mb-4">
              <Button 
                variant="success" 
                size="lg" 
                className="px-5 py-3 fs-4 fw-bold btn-neon"
                onClick={() => navigate('/selection')}
              >
                ¡JUGAR AHORA!
              </Button>
            </div>

            <p className="text-white fs-5 fw-bold">
              • 10 preguntas • Poketrivia • Diferentes categorías
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Home