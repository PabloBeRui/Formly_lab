import { FormlyFieldConfig } from '@ngx-formly/core';

/**
 * ? ¿QUÉ ES UNA EXTENSIÓN EN FORMLY?
 * Es un "Interceptor" que se ejecuta durante el ciclo de vida del campo.
 * Permite automatizar cambios en los campos sin tocarlos uno a uno en el JSON
 * Formly tiene 3 fases principales donde podemos actuar:
 ** 1. prePopulate: Antes de que el campo se configure (ideal para "hackear" props).
 ** 2. onPopulate: Cuando el campo ya tiene su configuración base.
 ** 3. postPopulate: Cuando el campo ya está totalmente listo para renderizarse.
 */

export const exampleExtension = {
  /**
   * @method prePopulate
   * @description Se ejecuta para CADA campo del JSON antes de dibujarlo.
   */
  prePopulate(field: FormlyFieldConfig) {
    //? 1. FILTRO: Solo actuamos si el campo es obligatorio
    if (!field.props?.required) return;

    //? 2. EVITAR DUPLICADOS: Si ya se ha procesado, lo salta
    if (field.props['_processed']) return;

    //! --- POSIBILIDAD A: Texto visible y fiable ---
    // Formly interpreta label como texto, no como HTML. Por eso se usa
    // una marca textual clara y una descripción visible debajo del campo.

    //? Label: Cambia "Correo Electrónico" por "Correo Electrónico (obligatorio)".

    //? Description: Inyecta el texto "Campo obligatorio".

    field.props.label = `${field.props.label} (extension)`;
    field.props.description = field.props.description
      ? `${field.props.description} Campo obligatorio extension.` // SI YA TIENE descripción, concatena
      : 'Campo obligatorio extension.'; // SI NO TIENE, créala desde cero

    //! --- POSIBILIDAD B: Estilos Dinámicos (CSS) ---
    //? Estética: Le añade clases de Bootstrap para ponerle un borde rojo suave.
    // Añade una clase de borde rojo a todos los inputs obligatorios
    field.className = `${field.className || ''} d-block border border-danger-subtle p-2 rounded`;

    //* A. Si el campo es un INPUT   -> Observa que puede "pisar" o añadir al className anterior si es input
  if (field.type === 'input') {
    // Aplica fondo amarillo claro (clase de Bootstrap 'bg-warning-subtle')
    // y un borde suave para que destaque.
    field.className = `${field.className || ''} d-block bg-warning-subtle border border-warning p-2 rounded`;
  }

  //* B. Si el campo es un CHECKBOX
  if (field.type === 'checkbox') {
    // En Bootstrap no hay un 'bg-orange', así que usamos estilos inline
    // o una clase personalizada. Aquí inyectamos un color naranja suave.
    field.props.attributes = {
      style: 'background-color: red; padding: 10px; border-radius: 5px; display: block;'
    };
  }

    //! --- POSIBILIDAD C: Lógica de Validación ---
    //? Validación: Ignora el mensaje global ("Este campo es obligatorio") y le asigna uno personalizado solo para este campo.
    // Sobrescribimos el mensaje de error global por uno específico para este campo
    field.validation = {
      messages: {
        required: 'Este dato es vital para el formulario (desde la extension).',
      },
    };

    //? Finalización: Marca el campo con _processed: true y se lo devuelve a Formly para que lo dibuje.
    field.props['_processed'] = true;
  },
};

//! Tres Pilares Claros:

//? HTML: Mediante field.props.label.

//? CSS: Mediante field.className.

//? Lógica: Mediante field.validation.

//! Como esta extensión usa prePopulate, los cambios ocurren antes de que los Wrappers se ejecuten. Esto garantiza que el Wrapper reciba el label ya modificado.
