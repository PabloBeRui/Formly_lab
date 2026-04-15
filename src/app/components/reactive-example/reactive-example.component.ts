import { JsonPipe } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyForm, FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

@Component({
  selector: 'reactive-example',
  imports: [ReactiveFormsModule, FormlyForm, JsonPipe],
  templateUrl: './reactive-example.component.html',
  styleUrl: './reactive-example.component.scss',
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

  //! Aquí es donde entran las dos propiedades más potentes de Formly (explicadas en detalle en el bloque 5 layout-example.component):

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
      //? Usamos un fieldGroup para envolver los dos inputs y poder compararlos
      fieldGroupClassName: 'row',
      hideExpression: (model) => !model.hasPet,
      validators: {
        //? Validadores de Grupo - fieldMatch: Permite validar un conjunto de campos comparándolos entre sí.
        //? En este caso, se asegura de que 'petName' y 'petNameConfirm' tengan el mismo valor.

        fieldMatch: {
          // el validador a nivel de fieldGroup, el control que recibe la función no es un input individual,
          //  sino el FormGroup que envuelve a los hijos.
          expression: (control: any) => {
            const value = control.value; //ejemp { petName: 'Firulais', petNameConfirm: 'Firulais' }.
            return value.petNameConfirm === value.petName || !value.petNameConfirm;
            //? || !value.petNameConfirm -> o si el segundo campo todavía está vacío
          },
          message: 'Los nombres no coinciden',
          errorPath: 'petNameConfirm', //? Indica que el error se muestre en el segundo input
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
    //! Ejemplo de expressionProperties para cambiar dinámicamente las propiedades de un campo según el modelo.
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
          model.country === 'ES'
            ? 'Ej: 28001'
            : model.country === 'OTHER'
              ? 'Introduce código internacional'
              : '',
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

    /**
     * Para limpiar el formulario tras un envío válido:
     * 1. Ejecutamos resetModel() para restablecer el modelo y el estado interno de Formly.
     * 2. Ejecutamos parentForm.resetForm() para limpiar el estado submitted del formulario padre.
     */

    // Limpia modelo + estado de Formly (pristine/untouched) y evita mostrar errores al volver vacío.
    this.options.resetModel?.();

    // También resetea el estado `submitted` del formulario padre para que Formly no pinte errores.
    this.options.parentForm?.resetForm();
  }
}

//!metodos

// resetModel(): Es un método exclusivo de Formly (dentro de FormlyFormOptions). Su función es devolver el modelo a su estado inicial y, muy importante, resetear los validadores internos de Formly para que no "griten" (se pongan rojos) al vaciarse.

// resetForm(): En realidad, este método suele venir del FormGroupDirective de Angular o de cómo Formly se integra con el formulario nativo. Al llamarlo a través de parentForm, estás limpiando el estado de "enviado" (submitted) del formulario. Si no limpias el estado submitted, los errores seguirán apareciendo aunque el campo sea untouched.

//! Diferencia (Evolutiva)
//? expressionProperties:
// Es el nombre clásico / antiguo.Se usaba en Formly v5 y v6.

// ?  expressions:
//  Es el nombre moderno / simplificado introducido a partir de Formly v6 / v7 para ser más conciso.

//* Dato clave: En las versiones actuales, Formly acepta ambos por compatibilidad, pero la documentación oficial ahora prioriza expressions porque es más corto de escribir.
