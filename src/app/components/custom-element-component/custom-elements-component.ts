import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyForm, FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

@Component({
  selector: 'app-custom-elements',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormlyForm],
  templateUrl: './custom-elements-component.html',
})
export class CustomElementsComponent {
  public form = new FormGroup({});
  // Objeto para controlar el comportamiento del formulario
  // (resetearlo, acceder al estado submitted, etc.).
  public options: FormlyFormOptions = {};
  public model = {};
  public fields: FormlyFieldConfig[] = [
    {
      key: 'address',
      type: 'input',
      //?  envuelve este input con el wrapper 'panel'
      wrappers: ['panel'],
      props: {
        label: 'Dirección de Envío',
        placeholder: 'Calle, número, piso...',
        description: 'Esta dirección se usará para la logística de entrega.',
        required: true,
      },
    },
    {
      key: 'notes',
      type: 'textarea',
      wrappers: ['panel'], //? Reutiliza el mismo wrapper en otro campo
      props: {
        label: 'Notas adicionales',
        rows: 3,
      },
    },
    {
      key: 'notes-dark',
      type: 'textarea',
      // ! ENCADENAMIENTO: Primero se envuelve en 'dark', y luego TODO eso en 'panel'
      //? El orden en el array suele ser de afuera hacia adentro o viceversa según la versión
      wrappers: ['dark', 'panel'],
      props: {
        label: 'Notas adicionales',
        rows: 3,
      },
    },
  ];

  public onSubmit(data: any) {
    if (this.form.valid) {
      console.log('Datos procesados:', this.model);
    }
  }
}
//? WRAPPER & ENCADENAMIENTO

/** * ? ¿QUÉ ES UN WRAPPER?
 * Es un "envoltorio" visual. El 'type' define el QUÉ (un input),
 * pero el 'wrapper' define el CÓMO SE PRESENTA (diseño, bordes, títulos).
 * *  EL ORDEN IMPORTANTE:
 * Los wrappers se aplican de IZQUIERDA a DERECHA (de afuera hacia adentro).
 * En ['panel', 'dark']:
 * 1. 'panel' es la capa EXTERIOR (la Card de Bootstrap).
 * 2. 'dark' es la capa INTERIOR (el fondo oscuro).
 * 3. El input queda en el centro de ambos.
 *
 * * Esto permite COMPONER interfaces complejas usando piezas pequeñas y reutilizables.
 */
