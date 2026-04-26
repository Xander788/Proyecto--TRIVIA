const Button = ({ 
  children, 
  variant = "primary", 
  size = "", 
  className = "", 
  disabled = false,
  onClick,
  ...props 
}) => {
  const sizeClass = size ? `btn-${size}` : ""
  
  return (
    <button 
      className={`btn btn-${variant} ${sizeClass} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button