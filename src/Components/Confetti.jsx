import { useEffect, useRef } from 'react';

const Confetti = ({ active, duration = 2500 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

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
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      confettiPieces.forEach((piece, i) => {
        piece.update();
        piece.draw();
        if (piece.y > canvas.height) confettiPieces.splice(i, 1);
      });

      if (confettiPieces.length > 0) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    animate();

    const timeout = setTimeout(() => {
      cancelAnimationFrame(animationFrame);
      if (canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, duration);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(animationFrame);
    };
  }, [active]);

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9999 }} />;
};

export default Confetti;