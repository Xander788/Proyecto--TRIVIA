import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Home from './Pages/Home'
import Selection from './Pages/Selection'
import GameTrivia from './Pages/GameTrivia'
import GamePokemon from './Pages/GamePokemon'
import Results from './Pages/Results'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/selection" element={<Selection />} />
        <Route path="/game-trivia" element={<GameTrivia />} />
        <Route path="/gamepokemon" element={<GamePokemon />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  )
}

export default App