import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyForm, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-global-extensions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormlyForm],
  templateUrl: './global-extensions-component.html',
  styleUrls: ['./global-extensions-component.scss'],
})
export class GlobalExtensionsComponent {
  public form = new FormGroup({});
  public model = {};

  public fields: FormlyFieldConfig[] = [
    {
      key: 'user_email',
      type: 'input',
      props: {
        label: 'Correo Electrónico',
        placeholder: 'ejemplo@correo.com',
        required: true, // <--- Este disparará TODA la magia
      },
    },
    {
      key: 'backup_email',
      type: 'input',
      props: {
        label: 'Correo Secundario',
        placeholder: 'Opcional...',
        required: false, // <--- Este se verá como un input normal y corriente
      },
    },
    {
      key: 'terms',
      type: 'checkbox',
      props: {
        label: 'Acepto los términos y condiciones',
        required: true, // <--- También funciona en otros tipos de campo
      },
    },
  ];
}
