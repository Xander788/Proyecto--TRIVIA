import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Home from './pages/Home'
import Selection from './pages/Selection'
import Game from './pages/Game'
import Results from './pages/Results'

function App() {
  return (
    <Router>
      <Navbar />
      
      <div className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/selection" element={<Selection />} />
          <Route path="/game" element={<Game />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App