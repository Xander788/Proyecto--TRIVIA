import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import UserProfile from './UserProfile'
import LoginModal from './LoginModal'
import Button from './Button'
import { getCurrentAccount, setCurrentAccount } from '../services/accountService'

const Navbar = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    const currentUser = getCurrentAccount()
    if (currentUser) {
      setUser(currentUser)
    }

    // Escuchar cambios en localStorage desde otras pestañas/componentes
    const handleStorageChange = () => {
      const updated = getCurrentAccount()
      setUser(updated)
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleLogout = () => {
    setUser(null)
    navigate('/')
  }

  const handleLoginSuccess = (userData) => {
    setUser(userData)
    setShowLoginModal(false)
  }

return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow">
      <div className="container">
        <a 
          className="navbar-brand fw-bold fs-4 d-flex align-items-center gap-2 neon-text" 
          href="#"
          onClick={(e) => { e.preventDefault(); navigate('/') }}
        >
          🧠 Trivia 
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
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); navigate('/') }}>
                Inicio
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); navigate('/selection') }}>
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