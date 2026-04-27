import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Home from './pages/Home' 
import Selection from './pages/Selection'
import GameTrivia from './pages/GameTrivia'
import GamePokemon from './pages/GamePokemon' 
import Results from './pages/Results' 

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/selection" element={<Selection />} />
        <Route path="/game-trivia" element={<GameTrivia />} />
        <Route path="/game-pokemon" element={<GamePokemon />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  )
}

export default App