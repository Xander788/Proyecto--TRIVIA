const Card = ({ children, className = "", ...props }) => {
  return (
    <div 
      className={`card glass-card ${className}`} 
      {...props}
    >
      {children}
    </div>
  )
}

export default Card