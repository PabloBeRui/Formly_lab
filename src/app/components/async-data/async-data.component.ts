import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyForm, FormlyFormOptions } from '@ngx-formly/core';
import { of, startWith, switchMap, tap } from 'rxjs';

import { Data } from '../../shared/services/data/data';

@Component({
  selector: 'app-async-data',
  imports: [CommonModule, ReactiveFormsModule, FormlyForm],
  templateUrl: './async-data.component.html',
  styleUrl: './async-data.component.scss',
})
export class AsyncDataComponent {
  /** Servicio de datos simulado que expone países y provincias como observables. */
  private readonly _dataService = inject(Data);

  /** FormGroup raíz consumido por Formly. */
  public form = new FormGroup({});

  /** Modelo inicial enlazado al formulario dinámico. */
  public model = {};

  /** Opciones de configuración global de Formly. */
  public options: FormlyFormOptions = {};

  /** Definición del formulario dinámico con selects asíncronos dependientes. */
  public fields: FormlyFieldConfig[] = [
    {
      key: 'country',
      type: 'select',
      props: {
        label: 'País',
        placeholder: 'Selecciona un país...',
        required: true,
        //? Enlace reactivo: No requiere pipe async manual ni suscripciones en el TS.
        //? El motor de Formly resuelve el flujo y mapea los datos al select.
        options: this._dataService.getCountries(),
      },
    },
    {
      key: 'province',
      type: 'select',
      props: {
        label: 'Provincia',
        placeholder: 'Selecciona primero un país...',
        required: true,
        options: [],
      },
      //expression alternativa
      expressions: {
        'props.disabled': '!model.country',
      },

      hooks: {
        //?  se llama a bindProvinceOptions para conectar este select con el de 'country'.
        onInit: (field) => this.bindProvinceOptions(field),
      },
    },
  ];

  /**
   * Enlaza las provincias al país seleccionado y reinicia la provincia cuando cambia el país.
   * @param field Campo Formly de provincias.
   */
  private bindProvinceOptions(field: FormlyFieldConfig): void {
    //? Accede al control del field 'country' a través del formulario padre. /valor actual, isvalid, dirty, touched, etc./
    //? sucede porque Formly vincula cada campo con la instancia del FormGroup para poder manejar sus eventos.
    const countryControl = field.form?.get('country');
    //Existe objeto?
    if (!countryControl) {
      return;
    }

    //* identifica la carga inicial fuera del flujo y evita reseteos accidentales.

    let isFirstEmission = true;
    //? Mantiene todas las propiedades configuradas previamente
    field.props = {
      ...field.props,
      //? Redefine 'options' como un flujo reactivo (Observable).
      options: countryControl.valueChanges.pipe(
        //* dispara el flujo con el valor actual nada más cargar el componente
        startWith(countryControl.value),
        tap(() => {
          // Si es la primera vez (carga inicial), no resetea nada.
          if (isFirstEmission) {
            isFirstEmission = false;
            return;
          }
          // Si el usuario cambia el país después, limpia el valor de la provincia.
          // 'emitEvent: false' evita disparar otras validaciones o efectos en cadena innecesarios.
          field.formControl?.reset(null, { emitEvent: false });
        }),
        // switchMap recibe el ID que emitió 'valueChanges' y lo cambia por una petición al servicio.
        switchMap((countryId) =>
          //  Si hay ID, llamamos al servicio; si no, devolvemos un array vacío.
          countryId ? this._dataService.getProvinces(countryId) : of([]),
        ),
      ),
    };
  }

  /**
   * Gestiona el envío del formulario y limpia el estado interno de Formly.
   * @param data Datos actuales del modelo.
   */
  public onSubmit(data: Record<string, unknown>): void {
    console.log('Final Data:', data);

    this.options.resetModel?.();
    this.options.parentForm?.resetForm();
  }
}

// =========================================================================
// 📘 DICCIONARIO: GESTIÓN DE PROPIEDADES DINÁMICAS (Expressions vs expressionProperties)
// =========================================================================

// -------------------------------------------------------------------------
// 1️⃣ OPCIÓN MODERNA: 'expressions' (Recomendado en v6/v7+)
// -------------------------------------------------------------------------
//? Estilo: Declarativo (String).
//? Ventaja: Más corto, serializable en JSON y optimizado en rendimiento.
//* expressions: {
// "Vigila el modelo; si 'country' está vacío, deshabilita este campo"
//  *'props.disabled': '!model.country',
//},

// -------------------------------------------------------------------------
// 2️⃣ OPCIÓN CLÁSICA: 'expressionProperties'
// -------------------------------------------------------------------------
//? Estilo: Funcional (Callback).
//? Ventaja: Permite lógica compleja, usar 'console.log' o depurar con 'debugger'.
//* expressionProperties: {
// "Ejecuta esta función cada vez que el modelo cambie"
//* 'props.required': (model, formState, field) => {
// model: Datos del formulario ({ country: 'ES', ... })
// formState: Datos globales que no están en el formulario
// field: Configuración completa del campo actual
//*   return model.country === 'es';
// },
//},

/**
 * 🧐 ¿CUÁL ELEGIR?
 * - Usa STRINGS (expressions) para condiciones simples: '!model.yyy', 'model.age > 18'.
 * - Usa FUNCIONES para lógica pesada o si necesitas acceder al 'formState'.
 * * NOTA: Ambas pueden usarse indistintamente en versiones modernas, pero
 ** 'expressions' es el estándar actual por ser más limpio.
 */

//!  Hooks de Formly:

// Diferencia con Angular: Mientras que los hooks de Angular (ngOnInit) controlan todo el componente, los de Formly te permiten inyectar lógica específica en un solo input del formulario sin afectar al resto.

// =========================================================================
// 💡 ¿POR QUÉ USAMOS 'MODEL' EN LAS EXPRESSIONS?
// =========================================================================

/**
 * Aunque el CONTROL gestiona el estado (valid, dirty, disabled),
 * Formly prefiere usar el MODELO en las 'expressions' por dos razones:
 * * 1. SIMPLICIDAD: Es más corto y legible escribir '!model.country' que
 * acceder a la jerarquía compleja de controles de Angular.
 * * 2. SINCRONIZACIÓN: Formly se encarga de que, en cuanto el 'model' cambie,
 * esa propiedad se traduzca automáticamente en un estado del 'control'.
 * * ? EN RESUMEN:
 * ? Las 'expressions' son el traductor: Leen del MODELO para cambiar el CONTROL.
 */

//expressions: {
// Leemos el dato (model) para cambiar el estado visual (props.disabled)
//  'props.disabled': '!model.country',
//},

//? isFirstEmission y el "reseteo accidental"

// ¿Cómo funciona la bandera isFirstEmission?
// La variable está fuera del pipe. Al ser un cierre (closure), se mantiene viva.

// Carga inicial: Entra al tap, ve que es true, la cambia a false y hace un return (salta el reset).

// Usuario cambia el país: Entra al tap, ve que ahora es false, salta el if y ejecuta el reset(). Ahora sí queremos resetear, porque si cambias de España a México, "Madrid" ya no vale.

// Recuerda
// valueChanges:
// propio de Angular Forms.Observable que emite un valor cada vez que el usuario toca el select.

// startWith:
//  Es necesario porque valueChanges solo habla cuando hay un CAMBIO.Si se entra al formulario y ya hay un país puesto, no hay "cambio", por lo que el select de provincias se quedaría vacío.startWith le da un "empujón" inicial al flujo con el valor que tenga el país en ese momento.
