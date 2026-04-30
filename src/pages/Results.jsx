import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Card from '../Components/Card';
import Button from '../Components/Button';
import { updateUserStats } from '../Login/accountService';   // ← IMPORTANTE

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showShareModal, setShowShareModal] = useState(false);

  const { score = 0, total = 10, gameMode = 'trivia' } = location.state || {};
  const incorrect = total - score;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  useEffect(() => {
    if (score !== undefined && total !== undefined) {
      const incorrectCount = total - score;
      updateUserStats(gameMode, score, incorrectCount);
    }
  }, [score, total, gameMode]);

  const handlePlayAgain = () => navigate('/selection');
  const handleGoHome = () => navigate('/');

  const shareOnWhatsApp = () => {
    const message = `¡Acabo de terminar la trivia! Obtuve ${score} de ${total} respuestas correctas (${percentage}%). ¿Te animas a probar? ${window.location.origin}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    setShowShareModal(false);
  };

  const shareOnFacebook = () => {
    const message = `He conseguido ${score} respuestas correctas en este test, prueba tu conocimiento en: ${window.location.origin}`;
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setShowShareModal(false);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-7 col-md-9">
          <Card className="p-5 text-center">

            <h1 className="justify-content-center fw-bold text-white">¡Fin del Juego!</h1>

            <div className="d-flex justify-content-center mb-5">
              <div style={{ position: 'relative', width: '240px', height: '240px' }}>
                <svg width="240" height="240" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="120" cy="120" r="105" fill="none" stroke="#2c3e50" strokeWidth="22" />
                  <circle 
                    cx="120" cy="120" r="105" fill="none" 
                    stroke="#00bc8c" strokeWidth="22"
                    strokeDasharray={`${(score / total) * 659} 659`}
                  />
                  <circle 
                    cx="120" cy="120" r="105" fill="none" 
                    stroke="#e74c3c" strokeWidth="22"
                    strokeDasharray={`${(incorrect / total) * 659} 659`}
                    strokeDashoffset={`-${(score / total) * 659}`}
                  />
                </svg>

                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: '#00bc8c', lineHeight: '1' }}>
                    {score}
                  </div>
                  <div style={{ fontSize: '1.8rem', color: '#e74c3c', marginTop: '-8px' }}>
                    {incorrect}
                  </div>
                  <div>
                    Aciertos / Errores
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-center gap-3 mb-3">
              <Button 
                variant="info" 
                size="lg" 
                className="flex-fill py-3 fs-5 text-dark"
                onClick={() => setShowShareModal(true)}
              >
                 Compartir
              </Button>

              <Button 
                variant="success" 
                size="lg" 
                className="flex-fill py-3 fs-5 text-dark"
                onClick={handlePlayAgain}
              >
                 Jugar de Nuevo
              </Button>
            </div>
            <Button 
              variant="outline-light" 
              size="lg" 
              className="py-3 fs-5 text-dark"
              onClick={handleGoHome}
            >
               Volver al Inicio
            </Button>
          </Card>
          
        </div>
      </div>

      {showShareModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={() => setShowShareModal(false)}>
          <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Compartir mis resultados</h5>
                <button type="button" className="btn-close" onClick={() => setShowShareModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="d-grid gap-3">
                  <Button variant="success" size="lg" className="py-3" onClick={shareOnWhatsApp}>
                     Compartir en WhatsApp
                  </Button>
                  <Button variant="primary" size="lg" className="py-3" onClick={shareOnFacebook}>
                     Compartir en Facebook
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;