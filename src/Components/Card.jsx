const Card = ({ children, className = "", ...props }) => {
  return (
    <div 
      className={`card shadow-sm ${className}`} 
      {...props}
    >
      {children}
    </div>
  )
}

export default Card