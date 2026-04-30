import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import AuthModal from '../Login/AuthModal';
import UserProfile from '../Login/UserProfile';
import { getCurrentUser, logoutUser } from '../Login/accountService';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    navigate('/');
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow sticky-top">
        <div className="container">
          <a 
            className="navbar-brand fw-bold fs-4 d-flex align-items-center gap-2 neon-text" 
            href="#"
            onClick={(e) => { e.preventDefault(); navigate('/'); }}
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
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item">
                <a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                  Inicio
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); navigate('/selection'); }}>
                  Nueva Partida
                </a>
              </li>

              <li className="nav-item ms-3">
                {user ? (
                  <UserProfile user={user} onLogout={handleLogout} />
                ) : (
                  <Button 
                    variant="outline-light"
                    size="md"
                    onClick={() => setShowLoginModal(true)}
                  >
                    Iniciar Sesión
                  </Button>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>


      <AuthModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        onLoginSuccess={handleLoginSuccess} 
      />
    </>
  );
};

export default Navbar;