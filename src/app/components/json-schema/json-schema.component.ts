import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyForm, FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';

@Component({
  selector: 'app-json-schema',
  imports: [CommonModule, ReactiveFormsModule, FormlyForm],
  templateUrl: './json-schema.component.html',
  styleUrl: './json-schema.component.scss',
})
export class JsonSchemaComponent {
  //? servicio es el motor que lee el JSON estándar (Schema)
  //? y lo traduce a Formly  (FormlyFieldConfig).
  private _formlyJsonschema = inject(FormlyJsonschema);
  // Objeto para controlar el comportamiento del formulario
  // (resetearlo, acceder al estado submitted, etc.).
  public options: FormlyFormOptions = {};

  //? contenedor del formulario::
  // - Antes: this._fb.group({}) -> "azúcar sintáctico".
  // - Ahora: new FormGroup({}) ->  forma base de Angular.
  // AMBAS HACEN LO MISMO: crean un objeto que rastrea si el formulario es válido o no.
  // En JSON Schema usar esta porque Formly creará los controles internos automáticamente.

  public form = new FormGroup({});
  public model = {};

  //? 1. Schema (Esto vendría normalmente de una API)
  // Sigue el estándar oficial de JSON Schema
  private _schema: any = {
    type: 'object',
    required: ['firstName', 'age'],
    properties: {
      firstName: {
        type: 'string',
        title: 'Nombre desde Schema',
        minLength: 3,
      },
      lastName: {
        type: 'string',
        title: 'Apellido',
      },
      age: {
        type: 'integer',
        title: 'Edad',
        minimum: 18,
      },
      gender: {
        type: 'string',
        title: 'Género',
        enum: ['Masculino', 'Femenino', 'Otro'],
      },
      active: {
        type: 'boolean',
        title: 'Suscripción Activa',
        default: true,
      },
    },
  };

  //? 2. Transforma el Schema en campos de Formly
  //! El método toFieldConfig() genera campos. Si devuelve tipo "object",
  //! lo envolvemos en un fieldGroup para que Formly lo entienda correctamente.
  public fields: FormlyFieldConfig[] = (() => {
    /** *
     * * toFieldConfig() convierte el Schema en un objeto FormlyFieldConfig.
     * Si el Schema es de tipo 'object', el resultado NO es una lista, sino UN SOLO OBJETO
     * "padre" que contiene a todos los demás dentro.
     */
    //?  devuelve un objeto que representa todo el JSON Schema.
    const schemaFields = this._formlyJsonschema.toFieldConfig(this._schema);

    /**
     * :
     * Por definición de Formly, un JSON Schema 'object' mapea sus propiedades a 'fieldGroup'.
     * Si dejamos el objeto padre, Formly crearía un nivel extra en los datos: { undefined: { nombre: '...' } }.
     *  Al retornar directamente 'fieldGroup', "vaciamos la caja" para que los campos
     * (firstName, age, etc.) queden en la raíz del formulario y el modelo sea plano.
     */
    //? Si el Schema es de tipo 'object', Formly guarda los inputs reales
    //?  dentro de la propiedad 'fieldGroup'.
    if (schemaFields.type === 'object' && schemaFields.fieldGroup) {
      // En lugar de devolver el "contenedor", devuelve directamente
      // la lista de campos que hay dentro.
      return schemaFields.fieldGroup;
    }
    /** 3. FALLBACK:
     * Formly exige que la propiedad 'fields' sea siempre un Array [].
     * Si el Schema no fuera un objeto (y por tanto no tuviera fieldGroup),
     *  resultado en corchetes para asegurar que el componente no explote.
     */
    //? Si no es un objeto, devuelve el campo tal cual dentro de un array.
    return [schemaFields];
  })();

  public onSubmit(data: any) {
    if (this.form.valid) {
      console.log('Datos procesados mediante Schema:', this.model);
    }
  }
}

//! Importante:

//? El problema del "Contenedor Raíz"
// Cuando se define un JSON Schema con type: 'object', el servicio toFieldConfig genera un único campo de tipo "objeto" que contiene a todos los demás dentro de una propiedad llamada fieldGroup.

// Antes: elarray fields tenía un solo elemento: un gran objeto "padre". A veces, Formly (especialmente con Bootstrap) no sabe cómo renderizar ese "padre" invisible y se queda en blanco esperando que le digas qué campos hay dentro.

// Ahora: Con la función autoejecutada (() => { ... })(), estás haciendo una extracción.

//? Fallback:

// la propiedad fields de Formly siempre debe ser un Array, incluso si solo tiene un elemento.

// El toFieldConfig devuelve un objeto.

// Formly necesita una lista [].

// Al hacer return [schemaFields], envolvuelve ese campo único en los corchetes que Formly necesita para poder leerlo.

//! Conceptos clave:

//? Extracción del Root: Evitas el "contenedor invisible" para que Bootstrap pinte los campos directamente.

//? Garantía de Array: Aseguras que Formly siempre reciba un iterable [], cumpliendo con su contrato de interfaz.

//? Desacoplamiento: Tu componente es ahora una "caja negra" que procesa cualquier Schema.
