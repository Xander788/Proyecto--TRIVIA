import { useEffect, useState } from 'react';

const Timer = ({ timeLeft }) => {
  const [isLowTime, setIsLowTime] = useState(false);

  useEffect(() => {
    setIsLowTime(timeLeft <= 5);
  }, [timeLeft]);

  return (
    <div 
      className={`badge timer-badge ${isLowTime ? 'timer-danger' : 'timer-success'}`}
    >
      ⏳ 
      <span className="timer-number">{timeLeft}</span>
      <span className="timer-unit">s</span>
    </div>
  );
};

export default Timer;