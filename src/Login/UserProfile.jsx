import { useState } from 'react';
import Button from '../Components/Button';

const UserProfile = ({ user, onLogout }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    onLogout();
    setShowMenu(false);
  };

  const triviaCorrect = user.correctTrivia || 0;
  const triviaIncorrect = user.incorrectTrivia || 0;
  const pokemonCorrect = user.correctPokemon || 0;
  const pokemonIncorrect = user.incorrectPokemon || 0;

  const triviaTotal = triviaCorrect + triviaIncorrect;
  const pokemonTotal = pokemonCorrect + pokemonIncorrect;

  const triviaPercent = triviaTotal > 0 ? Math.round((triviaCorrect / triviaTotal) * 100) : 0;
  const pokemonPercent = pokemonTotal > 0 ? Math.round((pokemonCorrect / pokemonTotal) * 100) : 0;

  const getColor = (correct, incorrect) => (correct > incorrect ? '#00bc8c' : '#e74c3c');
  const getProfileImage = () => {
    if (user.picture) return user.picture;
    if (user.image) return user.image;
    
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=6366f1&color=fff&size=128&bold=true`;
  };

  return (
    <div className="d-flex align-items-center gap-3 position-relative">
      <div
        className="d-flex align-items-center gap-2 cursor-pointer"
        onClick={() => setShowMenu(!showMenu)}
      >

        <img
          src={getProfileImage()}
          alt={user.username}
          className="rounded-circle border border-light"
          style={{ width: '38px', height: '38px', objectFit: 'cover' }}
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=6366f1&color=fff&size=128`;
          }}
        />

        <div>
          <span className="text-white fw-medium">{user.username}</span>
        </div>

        <div className="d-flex gap-2 ms-2">
          <div style={{ position: 'relative', width: '34px', height: '34px' }} title={`Trivia: ${triviaCorrect}/${triviaTotal} (${triviaPercent}%)`}>
            <svg width="34" height="34" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="17" cy="17" r="14" fill="none" stroke="#2c3e50" strokeWidth="5" />
              <circle
                cx="17"
                cy="17"
                r="14"
                fill="none"
                stroke={getColor(triviaCorrect, triviaIncorrect)}
                strokeWidth="5"
                strokeDasharray={`${(triviaPercent / 100) * 88} 88`}
              />
            </svg>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '9px',
              fontWeight: 'bold',
              color: getColor(triviaCorrect, triviaIncorrect)
            }}>
              {triviaPercent}%
              
            </div>
            <strong>Trivia</strong>
          </div>

          <div style={{ position: 'relative', width: '34px', height: '34px' }} title={`Pokémon: ${pokemonCorrect}/${pokemonTotal} (${pokemonPercent}%)`}>
            <svg width="34" height="34" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="17" cy="17" r="14" fill="none" stroke="#2c3e50" strokeWidth="5" />
              <circle
                cx="17"
                cy="17"
                r="14"
                fill="none"
                stroke={getColor(pokemonCorrect, pokemonIncorrect)}
                strokeWidth="5"
                strokeDasharray={`${(pokemonPercent / 100) * 88} 88`}
              />
            </svg>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '9px',
              fontWeight: 'bold',
              color: getColor(pokemonCorrect, pokemonIncorrect)
            }}>
              {pokemonPercent}%
            </div>
            <strong>Pokemon</strong>
          </div>
        </div>
      </div>

      {showMenu && (
        <div className="position-absolute top-100 end-0 bg-dark border border-secondary rounded shadow mt-2 py-1" style={{ minWidth: '160px', zIndex: 1050 }}>
          <Button variant="outline-danger" className="w-100 rounded-0 border-0" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;