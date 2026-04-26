const Timer = ({ timeLeft }) => {
  return (
    <div className="text-danger fw-bold fs-5">
      ⏱ {timeLeft} segundos
    </div>
  )
}

export default Timer