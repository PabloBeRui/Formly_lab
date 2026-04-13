import { Component } from '@angular/core';
import { FieldWrapper, FormlyModule } from '@ngx-formly/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-panel-wrapper.component',
  imports: [CommonModule, FormlyModule],
  templateUrl: './panel-wrapper.component.html',
  styleUrl: './panel-wrapper.component.scss',
})
export class PanelWrapperComponent extends FieldWrapper {
  /**
   * Al extender de FieldWrapper, heredamos 'field', 'props', etc.
   * El marcador #fieldComponent es obligatorio para que Formly sepa
   * dónde colocar el control.
   */
  //? Para que funcione el wrapper, debe estar registrado en app.config.ts
}
