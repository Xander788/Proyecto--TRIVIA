import jorge from '../Login/Avatars/Jorge.jpg';
import alexander from '../Login/Avatars/Alexander.jpg';
import andres from '../Login/Avatars/Andres.jpg';
import juanpablo from '../Login/Avatars/JuanPablo.jpg';
import victor from '../Login/Avatars/victor.jpg';

const PREDEFINED_USERS = [
  {
    id: 1,
    username: "victor.lopez",
    email: "victor.lopez@trivia.com",
    password: "123456",
    picture: victor,
    provider: "facebook",
    correctAnswers: 0,
    incorrectAnswers: 0
  },
  {
    id: 2,
    username: "alexander.ramirez",
    email: "alexander.ramirez@trivia.com",
    password: "123456",
    picture: alexander,
    provider: "facebook",
    correctAnswers: 0,
    incorrectAnswers: 0
  },
  {
    id: 3,
    username: "juanpablo.rodriguez",
    email: "juanpablo.rodriguez@trivia.com",
    password: "123456",
    picture: juanpablo,
    provider: "facebook",
    correctAnswers: 0,
    incorrectAnswers: 0
  },
  {
    id: 4,
    username: "jorge.rojas",
    email: "jorge.rojas@trivia.com",
    password: "123456",
    picture: jorge,
    provider: "facebook",
    correctAnswers: 0,
    incorrectAnswers: 0
  },
  {
    id: 5,
    username: "andres.bolandi",
    email: "andres.bolandi@trivia.com",
    password: "123456",
    picture: andres,
    provider: "facebook",
    correctAnswers: 0,
    incorrectAnswers: 0
  }
];

export const getAllUsers = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('triviaUsers') || '[]');
    const allUsers = [...PREDEFINED_USERS];
    
    saved.forEach(savedUser => {
      if (!allUsers.some(u => u.email === savedUser.email)) {
        allUsers.push(savedUser);
      }
    });
    
    return allUsers;
  } catch (error) {
    return [...PREDEFINED_USERS];
  }
};

export const saveUser = (userData) => {
  try {
    const allUsers = getAllUsers();
    if (allUsers.some(u => 
      u.username.toLowerCase() === userData.username.toLowerCase() || 
      u.email.toLowerCase() === userData.email.toLowerCase()
    )) {
      return false;
    }

    const usersToSave = [...JSON.parse(localStorage.getItem('triviaUsers') || '[]'), userData];
    localStorage.setItem('triviaUsers', JSON.stringify(usersToSave));
    
    localStorage.setItem('currentUser', JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error("Error guardando usuario:", error);
    return false;
  }
};

export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const logoutUser = () => {
  localStorage.removeItem('currentUser');
};

export const verifyLogin = (identifier, password) => {
  const users = getAllUsers();
  return users.find(u => 
    (u.username.toLowerCase() === identifier.toLowerCase() || 
     u.email.toLowerCase() === identifier.toLowerCase()) && 
    u.password === password
  );
};

export const updateUserStats = (mode, correct, incorrect) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;

    if (mode === 'trivia') {
      currentUser.correctTrivia = (currentUser.correctTrivia || 0) + correct;
      currentUser.incorrectTrivia = (currentUser.incorrectTrivia || 0) + incorrect;
    } else if (mode === 'pokemon') {
      currentUser.correctPokemon = (currentUser.correctPokemon || 0) + correct;
      currentUser.incorrectPokemon = (currentUser.incorrectPokemon || 0) + incorrect;
    }

    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    const savedUsers = JSON.parse(localStorage.getItem('triviaUsers') || '[]');
    const index = savedUsers.findIndex(u => u.email === currentUser.email);
    if (index !== -1) {
      savedUsers[index] = currentUser;
      localStorage.setItem('triviaUsers', JSON.stringify(savedUsers));
    }

    return true;
  } catch (error) {
    console.error("Error actualizando estadísticas:", error);
    return false;
  }
};