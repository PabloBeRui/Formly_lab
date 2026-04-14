import { JsonPipe } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyForm, FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

@Component({
  selector: 'form-example',
  standalone: true,
  imports: [ReactiveFormsModule, FormlyForm, JsonPipe],
  templateUrl: './form-example.html',
  styleUrl: './form-example.scss',
})
export class FormExample {
  /** @param {FormBuilder} _fb - Servicio inyectado para la creación de formularios */
  private _fb = inject(FormBuilder);

  /** @param {FormGroup} form - Instancia del formulario reactivo */
  public form: FormGroup = this._fb.group({});

  /** @param {any} model - Modelo de datos que vincula Formly */
  public model: any = { username: 'Pedro' };

  /** @param {FormlyFormOptions} options - Opciones de configuración de Formly */
  public options: FormlyFormOptions = {};

  /** @param {FormlyFieldConfig[]} fields - Configuración de los campos del formulario */
  public fields: FormlyFieldConfig[] = [
    {
      key: 'username',
      type: 'input', // Tipo de campo (input, textarea, checkbox, radio, select)
      props: {
        label: 'Nombre de usuario', // Etiqueta visible
        placeholder: 'Ej: juan_perez', // Texto de ayuda interno
        required: true, // Validación: obligatorio
        minLength: 5, // Validación: longitud mínima
        maxLength: 20, // Validación: longitud máxima
        description: 'El nombre debe ser único', // Texto pequeño debajo del campo
        disabled: false, // Estado: deshabilitado
        readonly: false, // Estado: solo lectura
        // type: 'password', // Cambia el comportamiento del input (password, number, email, date)
      },
      // Propiedad para mensajes de error personalizados
      validation: {
        //? 'field' es la configuración completa del campo específico que falló.
        messages: {
          required: (error, field: FormlyFieldConfig) =>
            `El campo "${field.props?.label}" es obligatorio`,
          minlength: (error, field: FormlyFieldConfig) =>
            `Mínimo ${field.props?.minLength} caracteres`,
        },
      },
    },
    {
      key: 'bio',
      type: 'textarea',
      props: {
        label: 'Biografía',
        rows: 5, // Propiedad específica de textarea: altura inicial
        placeholder: 'Cuéntanos algo sobre ti...',
      },
    },
    {
      key: 'gender',
      type: 'radio',
      props: {
        label: 'Género',
        required: true,
        // Las opciones siempre siguen esta estructura de objetos
        options: [
          { label: 'Masculino', value: 'M' },
          { label: 'Femenino', value: 'F' },
        ],
        formCheck: 'inline', // Opción de formly para Bootstrap: muestra los radios en la misma línea
      },
    },
    {
      key: 'country',
      type: 'select',
      props: {
        label: 'País de residencia',
        placeholder: 'Selecciona un país', // En select, aparece como la primera opción vacía
        options: [
          { label: 'España', value: 'ES' },
          { label: 'México', value: 'MX' },
          { label: 'Argentina', value: 'AR' },
        ],
        multiple: false, // Si se pone en true, permite selección múltiple (si el tema lo soporta)
      },
    },
    {
      key: 'age',
      type: 'input',
      props: {
        label: 'Edad',
        type: 'number', // Renderiza un input numérico con flechas
        min: 18, // Valor numérico mínimo
        max: 99, // Valor numérico máximo
      },
      validation: {
        messages: {
          min: (error, field: FormlyFieldConfig) => `Debes tener al menos ${field.props?.min} años`,
        },
      },
    },
    {
      key: 'terms',
      type: 'checkbox',
      props: {
        label: 'Acepto la política de privacidad',
        // required: true, // no se usa, se hace una validacion personalizada
      },
      validators: {
        //? IMPORTANTE: En checkboxes, 'required' no basta porque 'false' cuenta como valor.
        // Se usa un validador personalizado para obligar a que el valor sea estrictamente 'true'.
        requiredTrue: {
          expression: (control: AbstractControl) => control.value === true,
          message: 'Debes aceptar los términos para continuar',
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
      console.log('Formulario inválido, revisa errores.');
      return;
    }

    console.log('Datos enviados:', data);

    /**
     * Para limpiar el formulario tras un envío válido:
     * 1. Ejecuta resetModel() para restablecer el modelo y el estado interno de Formly.
     * 2. Ejecuta parentForm.resetForm() para limpiar el estado submitted del formulario padre.
     */

    // Limpia modelo + estado de Formly (pristine/untouched) y evita mostrar errores al volver vacío.
    this.options.resetModel?.();

    // También resetea el estado `submitted` del formulario padre para que Formly no pinte errores.
    this.options.parentForm?.resetForm();
  }
}

//!metodos

//* resetModel(): Es un método exclusivo de Formly (dentro de FormlyFormOptions). Su función es devolver el modelo a su estado inicial y, muy importante, resetear los validadores internos de Formly para que no "griten" (se pongan rojos) al vaciarse.

//* resetForm(): En realidad, este método suele venir del FormGroupDirective de Angular o de cómo Formly se integra con el formulario nativo. Al llamarlo a través de parentForm, estás limpiando el estado de "enviado" (submitted) del formulario. Si no limpias el estado submitted, los errores seguirán apareciendo aunque el campo sea untouched.

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
