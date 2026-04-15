import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { FormlyModule, FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

@Component({
  selector: 'app-global-validation',
  imports: [CommonModule, ReactiveFormsModule, FormlyModule],
  templateUrl: './global-validation.html',
  styleUrl: './global-validation.scss',
})
export class GlobalValidation {
  public form = new FormGroup({});
  public model = {};
  public options: FormlyFormOptions = {};

  //! Observa cómo los mensajes de error se resuelven sin estar definidos en este componente.
  //? Miralo en app.config.ts, en la sección de validationMessages.

  //* Observa que para la contraseña, Formly/Angular usan la clave minlength (todo en minúsculas),
  //*mientras que en las props es minLength(CamelCase). Esto se debe a que Formly sigue la convención de Angular para los mensajes de error, que utiliza claves en minúsculas para los tipos de error (required, minlength, maxlength, etc.). Por otro lado, las props de validación en Formly pueden usar CamelCase para mayor claridad en la configuración del campo. Es importante recordar esta diferencia al configurar validaciones y mensajes personalizados en Formly.

  fields: FormlyFieldConfig[] = [
    {
      key: 'email',
      type: 'input',
      props: {
        label: 'Correo Electrónico',
        placeholder: 'ejemplo@correo.com',
        required: true,
        type: 'email',
      },
    },
    {
      key: 'password',
      type: 'input',
      props: {
        label: 'Contraseña',
        type: 'password',
        required: true,
        minLength: 8, // El mensaje dinámico usará este valor
      },
    },
    {
      key: 'nickname',
      type: 'input',
      props: {
        label: 'Nombre de Laboratorio',
        required: true,
      },
      validators: {
        // Validador síncrono personalizado local que usa mensaje global
        disallowedName: {
          expression: (control: AbstractControl) => {
            const forbidden = ['pepe', 'ia', 'robot'];
            return !forbidden.includes(control.value?.toLowerCase());
          },
        },
      },
    },
  ];

  onSubmit(data: any) {
    if (this.form.valid) {
      console.log('Datos válidos:', data);
    }
  }
}
