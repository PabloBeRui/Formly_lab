import { JsonPipe } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyForm, FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

@Component({
  selector: 'reactive-example',
  imports: [ReactiveFormsModule, FormlyForm, JsonPipe],
  templateUrl: './reactive-example-component.html',
  styleUrl: './reactive-example-component.scss',
})
export class ReactiveExampleComponent {
  /** @param {FormBuilder} _fb - Servicio inyectado para la creación de formularios */
  private _fb = inject(FormBuilder);

  /** @param {FormGroup} form - Instancia del formulario reactivo */
  public form: FormGroup = this._fb.group({});

  /** @param {any} model - Modelo de datos que vincula Formly */
  public model: any = { name: 'Pedro' };
  /** @param {FormlyFormOptions} options - Opciones de configuración de Formly */
  public options: FormlyFormOptions = {};

  //! Aquí es donde entran las dos propiedades más potentes de Formly:

  //? hideExpression: Sirve para mostrar u ocultar campos dinámicamente.

  // Ejemplo: Solo mostrar el campo "¿Cuál es tu cuenta de Twitter?" si el usuario marca el checkbox "Tengo redes sociales".

  //? expressionProperties: Sirve para cambiar propiedades de un campo en tiempo real.

  // Ejemplo: Que el campo "Sueldo" se vuelva obligatorio (required) solo si el usuario selecciona que su tipo de contrato es "Indefinido".

  /** @param {FormlyFieldConfig[]} fields - Diccionario de Lógica Reactiva y Validaciones Cruzadas */
  public fields: FormlyFieldConfig[] = [
    {
      key: 'hasPet',
      type: 'checkbox',
      props: {
        label: '¿Tienes mascota?',
      },
    },
    {
      // Usamos un fieldGroup para envolver los dos inputs y poder compararlos
      fieldGroupClassName: 'row',
      hideExpression: (model) => !model.hasPet,
      validators: {
        // DICCIONARIO: Validadores de Grupo
        // Comprobamos que el valor de 'petName' sea igual al de 'petNameConfirm'
        fieldMatch: {
          expression: (control: any) => {
            const value = control.value;
            return value.petNameConfirm === value.petName || !value.petNameConfirm;
          },
          message: 'Los nombres no coinciden',
          errorPath: 'petNameConfirm', // Indica que el error se muestre en el segundo input
        },
      },
      fieldGroup: [
        {
          className: 'col-6',
          key: 'petName',
          type: 'input',
          props: {
            label: 'Nombre de tu mascota',
            placeholder: 'Ej: Firulais',
            required: true,
          },
        },
        {
          className: 'col-6',
          key: 'petNameConfirm',
          type: 'input',
          props: {
            label: 'Confirma el nombre',
            placeholder: 'Repite el nombre',
            required: true,
          },
        },
      ],
    },
    {
      template: '<hr />',
    },
    {
      key: 'country',
      type: 'select',
      props: {
        label: 'País',
        options: [
          { label: 'España', value: 'ES' },
          { label: 'Otros', value: 'OTHER' },
        ],
      },
    },
    {
      key: 'postalCode',
      type: 'input',
      props: {
        label: 'Código Postal',
      },
      // DICCIONARIO: expressionProperties
      // ?Cambia propiedades dinámicamente según el estado del modelo
      expressionProperties: {
        'props.required': (model) => model.country === 'ES',
        'props.placeholder': (model) =>
          model.country === 'ES' ? 'Ej: 28001' : 'Introduce código internacional',
      },
    },
  ];

  //! Observa el Inspector JSON: uando un campo se oculta por hideExpression,
  //!  Formly elimina automáticamente esa propiedad del modelo para que no envíes datos basura al servidor.

  /**
   * @description Maneja el envío del formulario.
   * Valida todos los campos, muestra errores si los hay,
   * y resetea al valor inicial si es válido.
   * @param {any} data - Los datos actuales del modelo.
   */
  public onSubmit(data: any): void {
    if (this.form.invalid) {
      /** * Si el formulario es inválido, marcamos todos los controles como
       * 'touched' (tocados). Formly detectará esto y mostrará
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
