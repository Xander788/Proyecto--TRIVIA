import { useEffect, useRef, useState } from 'react';

const Confetti = ({ active, duration = 2500 }) => {
  const canvasRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Mostrar el canvas solo cuando está activo
  useEffect(() => {
    if (active) {
      setIsVisible(true);
    }
  }, [active]);

  useEffect(() => {
    if (!isVisible || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Ajustar tamaño del canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const colors = ['#00bc8c', '#c084fc', '#f1c40f', '#e74c3c', '#3498db'];
    const confettiPieces = [];

    class Piece {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.size = Math.random() * 12 + 8;
        this.speed = Math.random() * 8 + 6;
        this.angle = Math.random() * 360;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.rotation = Math.random() * 0.02 - 0.01;
      }
      update() {
        this.y += this.speed;
        this.angle += this.rotation;
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
      }
    }

    for (let i = 0; i < 180; i++) {
      confettiPieces.push(new Piece());
    }

    let animationFrame;
    let isCancelled = false;

    const animate = () => {
      if (isCancelled) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Filtrar piezas que ya salieron de la pantalla
      const activePieces = confettiPieces.filter(piece => piece.y <= canvas.height);
      
      activePieces.forEach((piece) => {
        piece.update();
        piece.draw();
      });

      // Actualizar el array solo con piezas activas
      confettiPieces.length = 0;
      confettiPieces.push(...activePieces);

      if (confettiPieces.length > 0) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    animate();

    const timeout = setTimeout(() => {
      isCancelled = true;
      cancelAnimationFrame(animationFrame);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setIsVisible(false);
    }, duration);

    return () => {
      isCancelled = true;
      clearTimeout(timeout);
      cancelAnimationFrame(animationFrame);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isVisible, duration]);

  // No renderizar nada si no está activo
  if (!isVisible) return null;

  return (
    <canvas 
      ref={canvasRef} 
      className="confetti-canvas"
    />
  );
};

export default Confetti;