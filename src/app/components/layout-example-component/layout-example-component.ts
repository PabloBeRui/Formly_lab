import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyForm, FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

@Component({
  selector: 'layout-example-component',
  imports: [ReactiveFormsModule, FormlyForm, JsonPipe],
  templateUrl: './layout-example-component.html',
  styleUrl: './layout-example-component.scss',
})
export class LayoutExampleComponent {
  /** @param {FormBuilder} _fb - Servicio inyectado para la creación de formularios */
  private _fb = inject(FormBuilder);

  /** @param {FormGroup} form - Instancia del formulario reactivo */
  public form: FormGroup = this._fb.group({});

  /** @param {any} model - Modelo de datos que vincula Formly */
  public model: any = { name: 'Pedro' };
  /**
   * @description
   * FormlyFormOptions agrupa metodos y estado del formulario generado por Formly.
   * Ejemplos usados aqui:
   * - resetModel(model): reinicia modelo + estado interno de campos Formly.
   * - parentForm?.resetForm(model): limpia estado submitted del formulario padre.
   */
  public options: FormlyFormOptions = {};

  /**
   * @description
   * Glosario rapido de propiedades Formly usadas en este archivo:
   * - key: nombre de la propiedad en model enlazada al campo.
   * - type: tipo de campo Formly (input, select, checkbox, etc.).
   * - props: propiedades de UI/validacion del tipo (label, required, options, disabled...).
   * - fieldGroup: agrupa campos hijos dentro de un mismo bloque.
   * - fieldGroupClassName: clases CSS del contenedor del group (ej: row).
   * - className: clases CSS del campo individual (ej: col-12 col-md-6).
   * - template: inserta HTML estatico entre campos.
   * - wrappers: envuelve un campo con componentes de presentacion del tema.
   * - hideExpression: expresion booleana para ocultar/mostrar el campo.
   * - expressionProperties: expresiones para actualizar props en tiempo real.
   */

  /**
   * @description
   * Diccionario de referencia para aprender layout en Formly con Bootstrap.
   * Clave mental:
   * - fieldGroupClassName: controla el contenedor (por ejemplo, row).
   * - className: controla la columna/ancho de cada campo.
   */
  public fields: FormlyFieldConfig[] = [
    /** BLOQUE 1: Grid base responsive (2 columnas en md+, 1 columna en mobile) */
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: 'col-12 col-md-6',
          key: 'firstName',
          type: 'input',
          props: {
            label: 'Nombre',
            required: true,
          },
        },
        {
          className: 'col-12 col-md-6 mb-3',
          key: 'lastName',
          type: 'input',
          props: {
            label: 'Apellidos',
            required: true,
          },
        },
      ],
    },

    /** BLOQUE 2: Separador visual con template */
    {
      template: '<hr /><h5 class="mb-3">Informacion de Ubicacion</h5>',
    },

    /** BLOQUE 3: Distribucion asimetrica 8/4 */
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: 'col-12 col-md-8',
          key: 'address',
          type: 'input',
          props: {
            label: 'Direccion calle',
            placeholder: 'Ej: Av. Principal 123',
          },
        },
        {
          className: 'col-12 col-md-4',
          key: 'zipCode',
          type: 'input',
          props: {
            label: 'Codigo Postal',
            type: 'number',
          },
        },
      ],
    },

    /** BLOQUE 4: Distribucion 5/4/3 */
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: 'col-12 col-md-5',
          key: 'city',
          type: 'input',
          props: { label: 'Ciudad' },
        },
        {
          className: 'col-12 col-md-4',
          key: 'province',
          type: 'select',
          props: {
            label: 'Provincia',
            options: [
              { label: 'Madrid', value: 'M' },
              { label: 'Barcelona', value: 'B' },
              { label: 'Valencia', value: 'V' },
            ],
          },
        },
        {
          className: 'col-12 col-md-3',
          key: 'country_code',
          type: 'input',
          props: {
            label: 'Prefijo',
            description: 'Ej: +34',
          },
        },
      ],
    },

    /**
     * BLOQUE 5: Visibilidad y comportamiento dinamico
     * - hideExpression: oculta/muestra un campo segun el model.
     * - expressionProperties: cambia propiedades del campo en tiempo real (disabled, label, description, etc.).
     * - wrappers: envuelve el campo con componentes visuales extra (por ejemplo, form-field del tema).
     */
    {
      template: '<hr /><h5 class="mb-3">Campos dinamicos</h5>',
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: 'col-12',
          key: 'isCompany',
          type: 'checkbox',
          props: {
            label: 'Es cuenta de empresa',
          },
        },
        {
          className: 'col-12 col-md-6',
          key: 'companyName',
          type: 'input',
          // En el tema Bootstrap el wrapper visual ya se aplica por defecto.
          // Solo define wrappers manualmente cuando se quiera un envoltorio custom.
          // hideExpression se evalua en cada cambio de model.
          // true => se oculta el campo; false => se muestra.
          //? isCompany es el nombre de la propiedad en el model. Si marcas el checkbox, model.isCompany será true.
          //? !model?.isCompany:  "Oculta este campo si NO existe o es falso isCompany en el modelo".
          // Si el checkbox anterior está apagado, este input de "Nombre de empresa" no existe en el DOM..
          hideExpression: (model: any) => !model?.isCompany,
          props: {
            label: 'Nombre fiscal de empresa',
            required: true,
          },
        },
        {
          className: 'col-12 col-md-6',
          key: 'taxId',
          type: 'input',
          //! expressionProperties permite mutar propiedades del campo en runtime.
          //? Clave: ruta de la propiedad a actualizar.
          //? Valor: funcion que devuelve el nuevo valor segun model/formState/field.
          expressionProperties: {
            // Si no es empresa, deshabilitamos el input.
            'props.disabled': (model: any) => !model?.isCompany,
            // La descripcion cambia segun el valor del checkbox.
            'props.description': (model: any) =>
              model?.isCompany
                ? 'Campo habilitado para empresas'
                : 'Marca la opcion de empresa para habilitarlo',
          },
          props: {
            label: 'NIF/CIF',
          },
        },
      ],
    },

    /** BLOQUE 6: Grupo visual anidado */
    {
      // Evita borde duro para que el contenedor no parezca un input cortado.
      fieldGroupClassName: 'bg-light p-3 mt-3 rounded',
      fieldGroup: [
        {
          template: '<h6 class="text-muted">Ajustes de cuenta</h6>',
        },
        {
          key: 'isPublic',
          type: 'checkbox',
          props: { label: 'Perfil público' },
        },
      ],
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
