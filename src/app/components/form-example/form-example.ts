import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyForm, FormlyFieldConfig } from '@ngx-formly/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'form-example',
  standalone: true,
  imports: [ReactiveFormsModule, FormlyForm],
  templateUrl: './form-example.html',
  styleUrl: './form-example.scss',
})
export class FormExample implements OnDestroy {
  /** @param {FormBuilder} _fb - Servicio inyectado para la creación de formularios */
  private _fb = inject(FormBuilder);

  /** @param {Subject<void>} _destroy$ - Subject para gestionar la desuscripción manual */
  private _destroy$ = new Subject<void>();

  /** @param {FormGroup} form - Instancia del formulario reactivo */
  public form: FormGroup = this._fb.group({});

  /** @param {any} model - Modelo de datos que vincula Formly */
  public model: any = { email: 'email@gmail.com' };

  /** @param {FormlyFieldConfig[]} fields - Configuración de los campos del formulario */
  public fields: FormlyFieldConfig[] = [
    {
      key: 'name',
      type: 'input',
      props: {
        label: 'Nombre completo',
        placeholder: 'Escribe tu nombre...',
        required: true,
      },
    },
    {
      key: 'description',
      type: 'textarea',
      props: {
        label: 'Biografía',
        placeholder: 'Cuéntanos sobre ti...',
        rows: 3,
      },
    },
    {
      key: 'age',
      type: 'input',
      props: {
        label: 'Edad',
        type: 'number', // Input de tipo numérico
        min: 18,
      },
    },
    {
      key: 'active',
      type: 'checkbox',
      props: {
        label: '¿Usuario activo?',
        description: 'Marca esta casilla si el usuario puede iniciar sesión',
      },
    },
  ];

  /**
   * @description Procesa el envío del formulario.
   * @param {any} model - El objeto de datos resultante del formulario.
   */
  public onSubmit(model: any): void {
    if (this.form.valid) {
      console.log('Formulario enviado:', model);
    }
  }

  /**
   * @description Ciclo de vida para limpiar suscripciones.
   */
  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}

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
