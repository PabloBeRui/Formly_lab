import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FieldArrayType, FormlyModule } from '@ngx-formly/core';

@Component({
  selector: 'repeat-type-component',
  imports: [CommonModule, FormlyModule],
  templateUrl: './repeat-type-component.html',
  styleUrl: './repeat-type-component.scss',
})
export class RepeatTypeComponent extends FieldArrayType {
  /**
   * !NOTA: FieldArrayType nos proporciona automáticamente:
   * ?- this.add(): Añade un objeto vacío al modelo y una nueva fila a la UI.
   * ?- this.remove(index): Elimina el objeto del modelo y la fila de la UI.
   */
  // *¿Por qué no hay @Input para las props?
  //  En Formly, al extender de FieldArrayType (que a su vez extiende de FieldType), el componente ya hereda automáticamente una propiedad llamada field.
  // Formly inyecta todo el objeto de configuración del JSON dentro de ese field.
  // Por eso, al escribir props.label o props.addText en el componente, Formly ya sabe que te refieres a lo que escribiste en el JSON del RepeatSectionComponent.
  // No necesitas declarar los inputs, porque la clase padre FieldArrayType ya los tiene definidos por ti.
  //! IMPORTANTE:
  /** * !  REGISTRO GLOBAL REQUERIDO
   * Para que el 'type: repeat' funcione, debe estar registrado en app.config.ts:
   * * provideFormly({
   * types: [
   * { name: 'repeat', component: RepeatTypeComponent },
   * ],
   * }),
   * * ? ¿Por qué? Formly asocia el string 'repeat' con la clase del componente
   * ? para saber qué HTML renderizar cuando encuentra ese tipo en el JSON.
   */
}
