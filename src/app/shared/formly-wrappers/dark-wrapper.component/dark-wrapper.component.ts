import { Component } from '@angular/core';
import { FieldWrapper, FormlyModule } from '@ngx-formly/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dark-wrapper',
  standalone: true,
  imports: [CommonModule, FormlyModule],
  templateUrl: './dark-wrapper.component.html',
  styleUrl: './dark-wrapper.component.scss',
})
export class DarkWrapperComponent extends FieldWrapper {
  /**
   * Al extender de FieldWrapper, heredamos 'field', 'props', etc.
   * El marcador #fieldComponent es obligatorio para que Formly sepa
   * dónde colocar el control.
   */
  //? Para que funcione el wrapper, debe estar registrado en app.config.ts
}
