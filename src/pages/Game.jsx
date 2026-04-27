import { useState, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "../Components/Card";
import Timer from "../Components/Timer";
import Pregunta from "../Components/Pregunta";
import Confetti from "../Components/Confetti";

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
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const hasFetched = useRef(false);
  const timerRef = useRef(null);

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

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (questions.length === 0 || selectedAnswer !== null) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleNextQuestion();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentQuestion, selectedAnswer, questions.length]);

  const currentQ = questions[currentQuestion];
  const allAnswers = useMemo(() => {
    if (!currentQ) return [];
    return [...currentQ.incorrect_answers, currentQ.correct_answer].sort(
      () => Math.random() - 0.5,
    );
  }, [currentQuestion, questions]);

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    const correct = answer === currentQ.correct_answer;
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2800);
    }

    setShowFeedback(true);

    if (timerRef.current) clearInterval(timerRef.current);

    setTimeout(() => {
      handleNextQuestion();
      setShowFeedback(false);
    }, 1800);
  };

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
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
        <h3 className="text-white">Cargando preguntas...</h3>
      </div>
    );
  if (!currentQ)
    return (
      <div className="text-center mt-5">
        <h3 className="text-white">Error</h3>
      </div>
    );

  return (
    <div className="container py-5">
      <Card className="p-4 mx-auto" style={{ maxWidth: "760px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0 text-white">
            Pregunta <strong>{currentQuestion + 1}</strong> / {questions.length}
          </h5>

          <div className="text-end">
            <div className="badge bg-primary fs-5 px-3 py-2">
              Puntuación: <strong>{score}</strong>
            </div>
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

        {showFeedback && (
          <div
            className={`text-center mt-3 fs-4 fw-bold ${isCorrect ? "text-success" : "text-primary"}`}
          >
            {isCorrect ? "¡Correcto! 🎉" : "¡Incorrecto!"}
          </div>
        )}
      </Card>

      <Confetti active={showConfetti} />
    </div>
  );
};

export default Game;
