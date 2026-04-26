import { useState, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "../Components/Card";
import Timer from "../Components/Timer";
import Pregunta from "../Components/Pregunta";

const Game = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { category = 9, difficulty = "easy" } = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(25);
  const [loading, setLoading] = useState(true);

  const hasFetched = useRef(false);
  const timerRef = useRef(null); // ← Nuevo: referencia al intervalo

  // ==================== CARGAR PREGUNTAS ====================
  useEffect(() => {
    const fetchQuestions = async () => {
      if (hasFetched.current) return;
      hasFetched.current = true;

      try {
        setLoading(true);
        const res = await fetch(
          `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`,
        );
        const data = await res.json();

        if (data.response_code === 0 && data.results.length > 0) {
          setQuestions(data.results);
          setTimeLeft(
            difficulty === "hard" ? 15 : difficulty === "medium" ? 20 : 25,
          );
        } else {
          alert("No hay suficientes preguntas");
          navigate("/selection");
        }
      } catch (err) {
        alert("Error de conexión");
        navigate("/selection");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [category, difficulty, navigate]);

  // ==================== TIMER ROBUSTO ====================
  useEffect(() => {
    // Limpiar timer anterior
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Solo iniciar timer si hay pregunta y aún no se respondió
    if (questions.length === 0 || selectedAnswer !== null) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleNextQuestion(); // tiempo agotado
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentQuestion, selectedAnswer, questions.length]); // solo depende de estos

  const currentQ = questions[currentQuestion];
  const allAnswers = useMemo(() => {
    if (!currentQ) return [];
    return [...currentQ.incorrect_answers, currentQ.correct_answer].sort(
      () => Math.random() - 0.5,
    );
  }, [currentQuestion, questions]);

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    const isCorrect = answer === currentQ.correct_answer;
    if (isCorrect) setScore(score + 1);

    // Limpiar timer al responder
    if (timerRef.current) clearInterval(timerRef.current);

    setTimeout(() => handleNextQuestion(), 1500);
  };

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      // Nuevo tiempo según dificultad
      setTimeLeft(
        difficulty === "hard" ? 15 : difficulty === "medium" ? 20 : 25,
      );
    } else {
      navigate("/results", { state: { score, total: questions.length } });
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <h3 className="text-light">Cargando preguntas...</h3>
      </div>
    );
  if (!currentQ)
    return (
      <div className="text-center mt-5">
        <h3 className="text-light">Error cargando pregunta</h3>
      </div>
    );

  return (
    <div className="container py-5">
      <Card className="glass-card mx-auto p-4" style={{ maxWidth: "760px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0">
            Pregunta <strong>{currentQuestion + 1}</strong> / {questions.length}
          </h5>

          <div className="progress" style={{ width: "220px", height: "8px" }}>
            <div
              className="progress-bar bg-info"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
            ></div>
          </div>

          <Timer timeLeft={timeLeft} />
        </div>

        <Pregunta
          pregunta={currentQ.question}
          respuestas={allAnswers}
          respuestaSeleccionada={selectedAnswer}
          onSeleccionar={handleAnswer}
          respuestaCorrecta={currentQ.correct_answer}
        />

        <div className="text-center mt-4">
          <small className="text-white fw-bold">
            Puntuación: <strong className="fs-4">{score}</strong>
          </small>
        </div>
      </Card>
    </div>
  );
};

export default Game;
