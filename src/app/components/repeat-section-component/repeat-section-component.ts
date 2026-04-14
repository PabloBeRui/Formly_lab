import { JsonPipe } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyForm, FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

@Component({
  selector: 'repeat-section-component',
  imports: [ReactiveFormsModule, FormlyForm, JsonPipe],
  templateUrl: './repeat-section-component.html',
  styleUrl: './repeat-section-component.scss',
})

//! IMPORTANTE:
//?  Este componente es un ejemplo de cómo gestionar secciones repetibles (arrays) en Formly. Sin embargo, para que funcione correctamente, suele ser necesario crear un "Custom Type" que extienda de FieldArrayType y defina la UI de los botones de añadir/eliminar. En este laboratorio, se usa la estructura estándar de Formly, pero ten en cuenta que el campo "investments" no mostrará nada en pantalla a menos que hayas configurado previamente el tipo 'repeat' con un componente personalizado.
/** * ! NOTA DE ARQUITECTURA: El "misterio" del campo vacío.
 * * ? ¿Por qué no aparece nada en pantalla si el JSON parece correcto?
 * Formly es un motor de lógica, no una librería de componentes visuales completa.
 * Proporciona el "cerebro" (propiedad fieldArray) para gestionar arrays en el modelo,
 * pero NO proporciona el "cuerpo" (botones de añadir/eliminar) por defecto.
 * * ? ¿Cuál es la solución?
 * Debemos crear un "Custom Type". Formly permite definir un componente propio
 * (que extienda de FieldArrayType) donde nosotros decidimos cómo se dibujan
 * los botones y cómo se itera la lista.
 * * ? Pasos para que este componente funcione:
 * 1. Crear 'RepeatTypeComponent' (el envoltorio con botones + y -).
 * 2. Registrarlo en la configuración global (app.config.ts) con el nombre 'repeat'.
 */
export class RepeatSectionComponent {
  /** @param {FormBuilder} _fb - Servicio inyectado para la creación de formularios */
  private _fb = inject(FormBuilder);

  /** @param {FormGroup} form - Instancia del formulario reactivo */
  public form: FormGroup = this._fb.group({});

  /** @param {any} model - Modelo de datos que vincula Formly */
  public model: any = { name: 'Pedro' };
  /** @param {FormlyFormOptions} options - Opciones de configuración de Formly */
  public options: FormlyFormOptions = {};

  /** @param {FormlyFieldConfig[]} fields - Diccionario de Secciones Repetibles */
  public fields: FormlyFieldConfig[] = [
    {
      key: 'investments', //? El nombre de la propiedad en el modelo será un array []
      type: 'repeat', // ? ¡OJO! requiere un componente custom.

      props: {
        addText: 'Añadir Inversión',
        label: 'Mis Inversiones',
      },
      fieldArray: {
        fieldGroupClassName: 'row align-items-center',
        fieldGroup: [
          {
            className: 'col-md-5',
            type: 'input',
            key: 'investmentName',
            props: {
              label: 'Nombre:',
              required: true,
              placeholder: 'Ej: Acciones Apple',
            },
          },
          {
            className: 'col-md-5',
            type: 'input',
            key: 'amount',
            props: {
              type: 'number',
              label: 'Cantidad ($):',
              required: true,
              min: 1,
            },
          },
          // En un repeat real, aquí suele ir un botón de "Eliminar"
          // gestionado por el componente que extiende de FieldArrayType
        ],
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
