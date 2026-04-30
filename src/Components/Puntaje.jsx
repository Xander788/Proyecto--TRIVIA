import { useEffect, useState } from 'react'

const CLAVE = 'trivia_historial'

export function guardarPartida({ score, total, categoria, dificultad }) {
  const categorias = {
    general_knowledge: 'Conocimiento General',
    film_and_tv: 'Películas y TV',
    science: 'Ciencia y Naturaleza',
    geography: 'Geografía',
    history: 'Historia',
    'Pokémon': 'Pokémon',
  }
  const dificultades = {
    easy: 'Fácil',
    medium: 'Medio',
    hard: 'Difícil',
  }

  const historial = JSON.parse(localStorage.getItem(CLAVE) || '[]')
  historial.unshift({
    score,
    total,
    categoria: categorias[categoria] || categoria,
    dificultad: dificultades[dificultad] || dificultad,
    fecha: new Date().toLocaleDateString('es-CR'),
  })
  localStorage.setItem(CLAVE, JSON.stringify(historial.slice(0, 10)))
}

export default function Puntaje() {
  const [historial, setHistorial] = useState([])

  useEffect(() => {
    setHistorial(JSON.parse(localStorage.getItem(CLAVE) || '[]'))
  }, [])

  if (historial.length === 0) return null

  return (
    <div className="mt-4">
      <h5 className="text-white fw-bold mb-3">📋 Historial de partidas</h5>
      <div className="table-responsive">
        <table className="table table-dark table-striped table-bordered text-center mb-0">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Categoría</th>
              <th>Dificultad</th>
              <th>Puntaje</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((p, i) => (
              <tr key={i}>
                <td>{p.fecha}</td>
                <td>{p.categoria}</td>
                <td>{p.dificultad}</td>
                <td>
                  {p.score}/{p.total}{' '}
                  <span className="text-success fw-bold">
                    ({Math.round((p.score / p.total) * 100)}%)
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        className="btn btn-outline-danger btn-sm mt-2"
        onClick={() => {
          localStorage.removeItem(CLAVE)
          setHistorial([])
        }}
      >
        🗑️ Borrar historial
      </button>
    </div>
  )
}