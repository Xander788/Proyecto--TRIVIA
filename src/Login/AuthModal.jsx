import React, { useState } from 'react';
import { getAllUsers, saveUser, verifyLogin } from './accountService';
import Button from '../Components/Button';

const DEFAULT_AVATAR = "/login/Avatars/default-avatar.jpg";

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState('menu');
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '',
    imagePreview: null,
    imageBase64: null
  });
  const [error, setError] = useState('');
  const [fbQuery, setFbQuery] = useState('');
  const [selectedFbUser, setSelectedFbUser] = useState(null);

  const users = getAllUsers();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        imagePreview: reader.result,
        imageBase64: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const { username, email, password, imageBase64 } = formData;

    if (!username || !email || !password) {
      setError('Usuario, correo y contraseña son obligatorios');
      return;
    }

    const newUser = {
      id: Date.now(),
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password,
      picture: imageBase64 || DEFAULT_AVATAR,
      provider: 'local',
      correctAnswers: 0,
      incorrectAnswers: 0
    };

    if (saveUser(newUser)) {
      onLoginSuccess(newUser);
      onClose();
    } else {
      setError('Ya existe un usuario con ese nombre o correo');
    }
  };

  const handleManualLogin = (e) => {
    e.preventDefault();
    const identifier = formData.username || formData.email;
    const user = verifyLogin(identifier, formData.password);
    
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      onLoginSuccess(user);
      onClose();
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  const handleFacebookLogin = () => {
    if (!fbQuery.trim()) return;
    const found = users.find(u => 
      u.provider === 'facebook' && 
      u.username.toLowerCase().includes(fbQuery.toLowerCase())
    );

    if (found) {
      setSelectedFbUser(found);
    } else {
      setError('Usuario no encontrado. Prueba con: victor.lopez, xander.ramirez, jp.rodriguez, jorge.rojas o andres.bolandi');
    }
  };

  const confirmFacebookLogin = () => {
    if (!selectedFbUser) return;
    localStorage.setItem('currentUser', JSON.stringify(selectedFbUser));
    onLoginSuccess(selectedFbUser);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Acceso a Trivia</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body">
            {mode === 'menu' && (
              <div className="d-grid gap-3">
                <Button variant="success" size="lg" onClick={() => setMode('register')}>
                  📝 Crear una Cuenta
                </Button>
                <Button variant="primary" size="lg" onClick={() => setMode('login')}>
                  🔑 Ya tengo una cuenta
                </Button>
                <Button 
                  variant="success" 
                  size="lg" 
                  onClick={() => setMode('facebook')}
                >
                  📘 Iniciar con Facebook
                </Button>
              </div>
            )}

            {mode === 'register' && (
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label className="form-label">Usuario</label>
                  <input 
                    type="text" 
                    name="username" 
                    className="form-control" 
                    value={formData.username} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Correo electrónico</label>
                  <input 
                    type="email" 
                    name="email" 
                    className="form-control" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Contraseña</label>
                  <input 
                    type="password" 
                    name="password" 
                    className="form-control" 
                    value={formData.password} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Foto de perfil (opcional)</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="form-control" 
                    onChange={handleImageChange}
                  />
                  {formData.imagePreview && (
                    <div className="mt-3 text-center">
                      <img 
                        src={formData.imagePreview} 
                        alt="Preview" 
                        className="rounded-circle border profile-img-lg" 
                      />
                    </div>
                  )}
                </div>

                {error && <p className="text-danger small">{error}</p>}

                <Button type="submit" variant="success" className="w-100 mb-2">
                  Crear Cuenta
                </Button>
                <Button variant="link" className="w-100" onClick={() => setMode('menu')}>
                  Volver
                </Button>
              </form>
            )}

            {mode === 'login' && (
              <form onSubmit={handleManualLogin}>
                <div className="mb-3">
                  <label className="form-label">Usuario o Correo</label>
                  <input 
                    type="text" 
                    name="username" 
                    className="form-control" 
                    value={formData.username} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Contraseña</label>
                  <input 
                    type="password" 
                    name="password" 
                    className="form-control" 
                    value={formData.password} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                {error && <p className="text-danger small">{error}</p>}
                <Button type="submit" variant="primary" className="w-100">Iniciar Sesión</Button>
                <Button variant="link" className="w-100 mt-2" onClick={() => setMode('menu')}>Volver</Button>
              </form>
            )}

            {mode === 'facebook' && (
              <div>
                <p className="mb-3">Busca tu usuario de Facebook:</p>
                <input 
                  type="text" 
                  className="form-control mb-3" 
                  placeholder="Ej: victor.lopez" 
                  value={fbQuery} 
                  onChange={(e) => setFbQuery(e.target.value)}
                />
                <Button variant="primary" className="w-100 mb-3" onClick={handleFacebookLogin}>
                  Buscar Usuario
                </Button>

                {selectedFbUser && (
                  <div className="text-center p-3 border rounded">
                    <img 
                      src={selectedFbUser.picture} 
                      alt={selectedFbUser.username}
                      className="rounded-circle mb-2 profile-img-md"
                    />
                    <p className="mb-1 fw-bold">{selectedFbUser.username}</p>
                    <Button variant="success" className="w-100" onClick={confirmFacebookLogin}>
                      Iniciar Sesión
                    </Button>
                  </div>
                )}

                {error && <p className="text-danger mt-3">{error}</p>}

                <Button variant="link" className="w-100 mt-3" onClick={() => {
                  setMode('menu');
                  setFbQuery('');
                  setSelectedFbUser(null);
                }}>
                  Volver
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;