import { useNavigate } from 'react-router-dom'
import Card from '../Components/Card'
import Button from '../Components/Button'

const Home = () => {
  const navigate = useNavigate()

  return (
    <div className="text-center mt-5">
      <Card className="mx-auto p-5" style={{ maxWidth: '600px' }}>
        <h1 className="display-4 mb-4">Trivia en Español</h1>
        <p className="lead mb-4">Pon a prueba tus conocimientos</p>
        
        <Button 
          variant="success" 
          size="lg"
          onClick={() => navigate('/selection')}
        >
          ¡JUGAR AHORA!
        </Button>
      </Card>
    </div>
  )
}

export default Home