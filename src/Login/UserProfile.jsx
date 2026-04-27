import { useState } from 'react';
import Button from '../Components/Button';

const UserProfile = ({ user, onLogout }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleLogout = () => {
    onLogout();
    setShowMenu(false);
  };

  // Imagen principal (la que subiste o la de la carpeta local)
  const mainImage = user.picture || user.image;

  // Imagen por defecto de internet (cuando falla la principal)
  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=6366f1&color=fff&size=128&bold=true`;

  const handleImageError = () => {
    setImgError(true);
  };

  return (
    <div className="d-flex align-items-center gap-3 position-relative">
      <div 
        className="d-flex align-items-center gap-2 cursor-pointer"
        onClick={() => setShowMenu(!showMenu)}
      >
        {/* Imagen de perfil con fallback */}
        <img 
          src={imgError ? defaultAvatar : mainImage} 
          alt={user.username}
          className="rounded-circle border border-light"
          style={{ 
            width: '40px', 
            height: '40px', 
            objectFit: 'cover' 
          }}
          onError={handleImageError}
        />

        <div>
          <span className="text-white fw-medium">{user.username}</span>
          {user.provider === 'facebook' && (
            <small className="text-info d-block" style={{ fontSize: '0.75rem' }}>
              📘 Facebook
            </small>
          )}
        </div>
      </div>

      {/* Menú desplegable */}
      {showMenu && (
        <div 
          className="position-absolute top-100 end-0 bg-dark border border-secondary rounded shadow-lg mt-2 py-1"
          style={{ minWidth: '180px', zIndex: 1050 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-2 border-bottom border-secondary">
            <small className="text-muted">Conectado como</small>
            <div className="fw-bold text-white">{user.username}</div>
            <small className="text-muted">{user.email}</small>
          </div>

          <Button
            variant="outline-danger"
            className="w-100 rounded-0 border-0"
            onClick={handleLogout}
          >
            Cerrar Sesión
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;