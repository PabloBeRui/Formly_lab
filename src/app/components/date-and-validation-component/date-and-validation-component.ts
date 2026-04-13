import { JsonPipe } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyForm, FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

@Component({
  selector: 'date-and-validation-component',
  imports: [ReactiveFormsModule, FormlyForm, JsonPipe],
  templateUrl: './date-and-validation-component.html',
  styleUrl: './date-and-validation-component.scss',
})
export class DateAndValidationComponent {
  /** @param {FormBuilder} _fb - Servicio inyectado para la creación de formularios */
  private _fb = inject(FormBuilder);

  /** @param {FormGroup} form - Instancia del formulario reactivo */
  public form: FormGroup = this._fb.group({});

  /** @param {any} model - Modelo de datos que vincula Formly */
  public model: any = { name: 'Pedro' };
  /** @param {FormlyFormOptions} options - Opciones de configuración de Formly */
  public options: FormlyFormOptions = {};

  /** @param {FormlyFieldConfig[]} fields - Diccionario Maestro de Fechas y Periodos */
  public fields: FormlyFieldConfig[] = [
    {
      key: 'birthDate',
      type: 'input',
      props: {
        type: 'date', // Renderiza el selector de fecha nativo del navegador
        label: 'Fecha de Nacimiento',
        required: true,
        description: 'Debes ser mayor de 18 años para registrarte',
      },
      validators: {
        //?  Validación de edad
        majorAge: {
          expression: (control: any) => {
            if (!control.value) return true;
            const birth = new Date(control.value);
            const today = new Date();
            const age = today.getFullYear() - birth.getFullYear();
            return age >= 18;
          },
          message: 'Debes tener al menos 18 años',
        },
      },
    },
    { template: '<hr /><h5>Reserva de Estancia</h5>' },
    {
      fieldGroupClassName: 'row',
      validators: {
        // ? Validación cruzada de periodos
        dateRange: {
          expression: (control: any) => {
            const { startDate, endDate } = control.value;
            if (!startDate || !endDate) return true;
            return new Date(endDate) >= new Date(startDate);
          },
          message: 'La fecha de salida no puede ser anterior a la de entrada',
          errorPath: 'endDate', // Marcamos el error en el segundo campo
        },
      },
      fieldGroup: [
        {
          className: 'col-6',
          key: 'startDate',
          type: 'input',
          props: {
            type: 'date',
            label: 'Fecha de Entrada',
            required: true,
          },
        },
        {
          className: 'col-6',
          key: 'endDate',
          type: 'input',
          props: {
            type: 'date',
            label: 'Fecha de Salida',
            required: true,
          },
        },
      ],
    },
    {
      key: 'appointment',
      type: 'input',
      props: {
        type: 'datetime-local', // Permite elegir fecha Y hora
        label: 'Cita con el consultor',
        description: 'Horario disponible de 09:00 a 18:00',
      },
      expressionProperties: {
        // ? Manipulación de estilos según hora
        'props.attributes': (model) => {
          //1. Convierte string del input a un objeto Date
          const date = model.appointment ? new Date(model.appointment) : null;
          // 2. Verifica si fecha existe y si la hora está fuera del rango
          if (date && (date.getHours() < 9 || date.getHours() > 18)) {
            // 3. Si antes 9am o después 6pm,
            // devuelve un objeto que Formly aplicará como atributo
            return {
              style: 'border: 2px solid orange;',
            };
          }
          // 4. Si ok, devuelve  objeto vacío sin estilos
          return {};
        },
      },
      validators: {
        businessHours: {
          expression: (control: any) => {
            if (!control.value) return true;
            const date = new Date(control.value);
            const actualDate = new Date();
            if (date < actualDate) return false; // No permite fechas pasadas
            return date.getHours() >= 9 && date.getHours() <= 18;
          },
          message:
            'Fecha u hora no disponible. El horario de atención es de 09:00 a 18:00 y no se permiten fechas pasadas.',
        },
      },
    },
  ];

  /**
   * @description Maneja el envío del formulario.
   * Valida todos los campos, muestra errores si los hay,
   * y resetea al valor inicial si es válido.
   * @param {any} data - Los datos actuales del modelo.
   */
  public onSubmit(data: any): void {
    if (this.form.invalid) {
      /** * Si el formulario es inválido, marcamos todos los controles como
       * 'touched'. Formly detectará esto y mostrará
       * automáticamente los mensajes de error en la UI.
       */
      this.form.markAllAsTouched();
      console.warn('Formulario inválido, revisa los errores.');
      return;
    }

    console.log('Datos enviados:', data);

    /**!
     * Para resetear el formulario a su valor inicial en Formly:
     * 1. Usamos this.form.reset() para limpiar el estado de Angular (validaciones/touched).
     * 2. Reasignamos el modelo a su estado original para que Formly actualice los inputs.
     */
    const emptyModel = {};
    this.model = emptyModel;

    // Limpia modelo + estado de Formly (pristine/untouched) y evita mostrar errores al volver vacío.
    this.options.resetModel?.(emptyModel);

    // También resetea el estado `submitted` del formulario padre para que Formly no pinte errores.
    this.options.parentForm?.resetForm(emptyModel);
  }
}

//!metodos

// resetModel(): Es un método exclusivo de Formly (dentro de FormlyFormOptions). Su función es devolver el modelo a su estado inicial y, muy importante, resetear los validadores internos de Formly para que no "griten" (se pongan rojos) al vaciarse.

// resetForm(): En realidad, este método suele venir del FormGroupDirective de Angular o de cómo Formly se integra con el formulario nativo. Al llamarlo a través de parentForm, estás limpiando el estado de "enviado" (submitted) del formulario. Si no limpias el estado submitted, los errores seguirán apareciendo aunque el campo sea untouched.

//? Flujo de la informacion:

// Paso A: En el TS, this._fb.group({}) crea una "estantería" vacía.

// Paso B: En el HTML, <form [formGroup]="form"> le dice a Angular: "Usa esta estantería".

// Paso C: <formly-form [form]="form" ...> le dice a Formly: "Toma la estantería de Angular y empieza a llenarla con los controles que definí en fields".

// Paso D: Formly mira el model. Si ve { name: 'Pedro' }, automáticamente pone "Pedro" dentro del input que tiene la key: 'name'.

//? Segund documentacion

//  form = new FormGroup({});
//   model = { email: 'email@gmail.com' };
//   fields: FormlyFieldConfig[] = [
//     {
//       key: 'email',
//       type: 'input',
//       props: {
//         label: 'Email address',
//         placeholder: 'Enter email',
//         required: true,
//       },
//     },
//   ];

//   onSubmit(model:any) {
//     console.log(model);
//   }
