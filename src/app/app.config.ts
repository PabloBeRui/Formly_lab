import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { withFormlyBootstrap } from '@ngx-formly/bootstrap';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideFormlyCore, FormlyFieldConfig } from '@ngx-formly/core';
import { RepeatTypeComponent } from './shared/formly-types/repeat-type/repeat-type.component';
import { PanelWrapperComponent } from './shared/formly-wrappers/panel-wrapper.component/panel-wrapper.component';
import { DarkWrapperComponent } from './shared/formly-wrappers/dark-wrapper.component/dark-wrapper.component';

import { exampleExtension } from './shared/formly-extensions/example-extension';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // Configuración unificada según formly v7: primero el tema Bootstrap y luego types y mensajes globales.
    provideFormlyCore([
      ...withFormlyBootstrap(),
      {
        // Registro de types personalizados
        types: [
          {
            name: 'repeat',
            component: RepeatTypeComponent,
          },
        ],
        //Registro de WRAPPERS
        wrappers: [
          { name: 'panel', component: PanelWrapperComponent },
          { name: 'dark', component: DarkWrapperComponent },
        ],
        //? Registro de la lógica de extensión global (se ejecuta para cada campo)
        // extensions: [{ name: 'example', extension: exampleExtension }],
        // Mensajes de validación globales (se pueden sobreescribir a nivel de campo)
        validationMessages: [
          { name: 'required', message: 'Este campo es obligatorio' },
          { name: 'pattern', message: 'El formato no es válido' },
          { name: 'email', message: 'El correo electrónico no es válido' },
          // ? Mensaje dinámico: usa las props del campo
          {
            name: 'minlength',
            message: (error: any, field: FormlyFieldConfig) =>
              `Mínimo ${field.props?.minLength} caracteres (llevas ${field.formControl?.value?.length})`,
          }, // Validador personalizado
          {
            name: 'disallowedName',
            message: '❌ Este nombre no está permitido en este laboratorio.',
          },
        ],
      },
    ]),
  ],
};

