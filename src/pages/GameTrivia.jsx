import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Card from '../Components/Card';
import Button from '../Components/Button';
import Timer from '../Components/Timer';
import Pregunta from '../Components/Pregunta';
import Confetti from '../Components/Confetti';

const mezclar = (arr) => {
  const copia = [...arr];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
};

const decodeHtml = (input) => {
  try {
    const txt = document.createElement('textarea');
    txt.innerHTML = input;
    return txt.value;
  } catch {
    return input || '';
  }
};

const traducirLote = async (textos) => {
  if (!textos || textos.length === 0) return textos;

  const textoUnido = textos.join(' ||| ');

  try {
    const respuesta = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(textoUnido)}&langpair=en|es`);
    if (!respuesta.ok) throw new Error('Error en traducción');

    const datos = await respuesta.json();
    const textoTraducido = datos.responseData?.translatedText || textoUnido;

    return textoTraducido.split(' ||| ').map(t => t.trim());
  } catch (err) {
    console.warn('Error traduciendo lote:', err);
    return textos;
  }
};

const fetchDeAPI = async (category, difficulty) => {
  const categoriaAPI = {
    general_knowledge: 9,
    film_and_tv: 11,
    science: 17,
    geography: 22,
    history: 23,
  }[category] || 9;

  const url = `https://opentdb.com/api.php?amount=10&category=${categoriaAPI}&difficulty=${difficulty}&type=multiple`;

  const respuesta = await fetch(url);
  if (!respuesta.ok) throw new Error(`Error de API: ${respuesta.status}`);

  const data = await respuesta.json();
  if (!data.results?.length) throw new Error('La API no devolvió preguntas');

  const preguntasTraducidas = await Promise.all(
    data.results.map(async (item) => {
      const preguntaRaw = decodeHtml(item.question);
      const correctaRaw = decodeHtml(item.correct_answer);
      const incorrectasRaw = item.incorrect_answers.map(decodeHtml);

      const textosParaTraducir = [preguntaRaw, ...incorrectasRaw, correctaRaw];
      const traducidos = await traducirLote(textosParaTraducir);

      const preguntaTraducida = traducidos[0];
      const correctaTraducida = traducidos[traducidos.length - 1];
      const incorrectasTraducidas = traducidos.slice(1, -1);

      const respuestas = mezclar([...incorrectasTraducidas, correctaTraducida]);

      return {
        pregunta: preguntaTraducida,
        respuestas,
        correcta: correctaTraducida,
      };
    })
  );

  return preguntasTraducidas;
};

const TIEMPO = { easy: 30, medium: 20, hard: 12 };

const GameTrivia = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { category = 'general_knowledge', difficulty = 'easy' } = location.state || {};

  const [preguntas, setPreguntas] = useState([]);
  const [indice, setIndice] = useState(0);
  const [respuestaElegida, setRespuestaElegida] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIEMPO[difficulty]);
  const [cargando, setCargando] = useState(true);
  const [confetti, setConfetti] = useState(false);

  const timerRef = useRef(null);
  const scoreRef = useRef(0);

 
  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await fetchDeAPI(category, difficulty);
        setPreguntas(data);
      } catch (err) {
        console.error('Error al cargar preguntas:', err);
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, [category, difficulty]);

  useEffect(() => {
    if (cargando || respuestaElegida !== null || !preguntas.length) return;

    setTimeLeft(TIEMPO[difficulty]);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setRespuestaElegida('__tiempo_agotado__');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [indice, cargando, respuestaElegida, difficulty, preguntas.length]);

  const handleSeleccionar = useCallback((respuesta) => {
    clearInterval(timerRef.current);
    setRespuestaElegida(respuesta);

    if (respuesta === preguntas[indice]?.correcta) {
      scoreRef.current += 1;
      setScore(scoreRef.current);
      setConfetti(true);
      setTimeout(() => setConfetti(false), 2500);
    }
  }, [indice, preguntas]);

  const handleSiguiente = () => {
    if (indice >= preguntas.length - 1) {
      navigate('/results', {
        state: {
          score: scoreRef.current,
          total: preguntas.length,
          gameMode: 'trivia',
        },
      });
    } else {
      setIndice((prev) => prev + 1);
      setRespuestaElegida(null);
    }
  };

  if (cargando) {
    return (
      <div className="container py-5 text-center">
        <Card className="p-5">
          <div className="spinner-border text-success mb-4" role="status" />
          <h4 className="text-white mb-2">Cargando preguntas...</h4>
          <p className="text-white opacity-75">Obteniendo y traduciendo preguntas</p>
        </Card>
      </div>
    );
  }

  const preguntaActual = preguntas[indice];
  if (!preguntaActual) return null;

  return (
    <div className="container py-2">
      <Confetti active={confetti} />

      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <span className="text-white fw-bold fs-5">
          Pregunta {indice + 1} / {preguntas.length}
        </span>
        <Timer timeLeft={timeLeft} />
        <span className="badge bg-success fs-6 px-3 py-2">
          ✅ {score} / {preguntas.length}
        </span>
      </div>

      <div className="progress mb-4" style={{ height: '8px' }}>
        <div
          className="progress-bar bg-success"
          style={{ width: `${((indice + 1) / preguntas.length) * 100}%` }}
        />
      </div>

      <Card className="p-4">
        <Pregunta
          pregunta={preguntaActual.pregunta}
          respuestas={preguntaActual.respuestas}
          respuestaSeleccionada={respuestaElegida}
          onSeleccionar={handleSeleccionar}
          respuestaCorrecta={preguntaActual.correcta}
        />

        {respuestaElegida && (
          <div className="mt-4 text-center">
            {respuestaElegida === preguntaActual.correcta ? (
              <p className="text-success fw-bold fs-4">🎉 ¡Correcto!</p>
            ) : respuestaElegida === '__tiempo_agotado__' ? (
              <p className="text-warning fw-bold fs-5">
                ⏰ Tiempo agotado<br />
                La respuesta correcta era: <strong>{preguntaActual.correcta}</strong>
              </p>
            ) : (
              <p className="text-danger fw-bold fs-5">
                ❌ Incorrecto<br />
                La respuesta correcta era: <strong>{preguntaActual.correcta}</strong>
              </p>
            )}

            <Button
              variant="success"
              size="lg"
              className="mt-3 px-5 fw-bold"
              onClick={handleSiguiente}
            >
              {indice >= preguntas.length - 1 ? '🏁 Ver Resultados' : 'Siguiente →'}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default GameTrivia;