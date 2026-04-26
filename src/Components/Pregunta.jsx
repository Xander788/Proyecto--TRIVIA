const Pregunta = ({ 
  pregunta, 
  respuestas, 
  respuestaSeleccionada, 
  onSeleccionar, 
  respuestaCorrecta 
}) => {
  return (
    <div>
      <h4 
        className="mb-4" 
        dangerouslySetInnerHTML={{ __html: pregunta }} 
      />

      <div className="d-grid gap-3">
        {respuestas.map((respuesta, index) => (
          <button
            key={index}
            className={`btn btn-lg text-start py-3 ${
              respuestaSeleccionada 
                ? (respuesta === respuestaCorrecta ? "btn-success" : "btn-danger")
                : "btn-outline-primary"
            }`}
            onClick={() => !respuestaSeleccionada && onSeleccionar(respuesta)}
            disabled={!!respuestaSeleccionada}
          >
            <span dangerouslySetInnerHTML={{ __html: respuesta }} />
          </button>
        ))}
      </div>
    </div>
  )
}

export default Pregunta