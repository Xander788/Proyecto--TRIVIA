import Button from '../Components/Button';

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
        className="mb-2 text-center neon-text text-white fw-bold fs-3"
        dangerouslySetInnerHTML={{ __html: pregunta }} 
      />

      <div className="d-grid gap-2">
        {respuestas.map((respuesta, index) => {
          let variant = "outline-light";
          let extraClass = "btn-neon py-2 text-start fw-medium text-white";

          if (respuestaSeleccionada) {
            if (respuesta === respuestaCorrecta) {
              variant = "success";
              extraClass = "py-2 text-start fw-bold text-white";
            } 
            else if (respuesta === respuestaSeleccionada) {
              variant = "primary";
              extraClass = "py-2 text-start fw-bold text-white";
            }
          }

          return (
            <Button
              key={index}
              variant={variant}
              className={extraClass}
              size="md"
              onClick={() => !respuestaSeleccionada && onSeleccionar(respuesta)}
              disabled={!!respuestaSeleccionada}
            >
              <span dangerouslySetInnerHTML={{ __html: respuesta }} />
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default Pregunta;