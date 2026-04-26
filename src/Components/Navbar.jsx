import { useNavigate } from 'react-router-dom'

const Navbar = ({ title = "🧠 Trivia React" }) => {
  const navigate = useNavigate()

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <a 
          className="navbar-brand fw-bold fs-4" 
          href="#"
          onClick={(e) => { e.preventDefault(); navigate('/') }}
        >
          🧠 Trivia en Español
        </a>

        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <a 
                className="nav-link" 
                href="#"
                onClick={(e) => { e.preventDefault(); navigate('/') }}
              >
                Inicio
              </a>
            </li>
            <li className="nav-item">
              <a 
                className="nav-link" 
                href="#"
                onClick={(e) => { e.preventDefault(); navigate('/selection') }}
              >
                Nueva Partida
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar