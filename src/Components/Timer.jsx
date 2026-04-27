import { useEffect, useState } from 'react';

const Timer = ({ timeLeft }) => {
  const [isLowTime, setIsLowTime] = useState(false);

  useEffect(() => {
    setIsLowTime(timeLeft <= 5);
  }, [timeLeft]);

  return (
    <div 
      className={`badge fs-5 px-4 py-2 border border-2 fw-bold d-flex align-items-center gap-2 ${
        isLowTime 
          ? 'bg-danger text-white border-danger' 
          : 'bg-success text-white border-success'
      }`}
      style={{
        fontSize: '1.1rem',
        minWidth: '110px',
        justifyContent: 'center',
      }}
    >
      ⏳ 
      <span className="fs-4 fw-bold">{timeLeft}</span>
      <span className="fs-6 opacity-75">s</span>
    </div>
  );
};

export default Timer;