import { useLocation, useNavigate } from 'react-router-dom'
import Card from '../Components/Card'
import Button from '../Components/Button'

const Results = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  const { score = 0, total = 10 } = location.state || {}
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0

  const shareOnWhatsApp = () => {
    const text = `¡Obtuve ${score}/${total} (${percentage}%) en Trivia Neon! 🎉`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div className="container py-5">
      <Card className="glass-card mx-auto text-center p-5" style={{ maxWidth: '620px' }}>
        <h1 className="display-1 fw-bold neon-text" style={{ color: '#22d3ee' }}>
          {percentage}%
        </h1>
        <h2 className="mb-4 text-light">¡Fin del Juego!</h2>

        <h4 className="mb-5 text-light">
          {score} de {total} correctas
        </h4>

        <div className="d-grid gap-3">
          <Button 
            variant="success" 
            size="lg" 
            className="btn-neon"
            onClick={shareOnWhatsApp}
          >
            📱 Compartir en WhatsApp
          </Button>
          
          <Button 
            variant="primary" 
            size="lg" 
            className="btn-neon"
            onClick={() => navigate('/selection')}
          >
            🔄 Jugar de Nuevo
          </Button>
          
          <Button 
            variant="outline-light" 
            size="lg" 
            className="btn-neon"
            onClick={() => navigate('/')}
          >
            🏠 Volver al Inicio
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default Results