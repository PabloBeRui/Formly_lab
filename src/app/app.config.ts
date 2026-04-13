import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { withFormlyBootstrap } from '@ngx-formly/bootstrap';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideFormlyCore } from '@ngx-formly/core';
import { RepeatTypeComponent } from './shared/formly-types/repeat-type-component/repeat-type-component';

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
        validationMessages: [
          { name: 'required', message: 'Este campo es obligatorio' },
          { name: 'pattern', message: 'El formato no es válido' },
          { name: 'email', message: 'El correo electrónico no es válido' },
        ],
      },
    ]),
  ],
};
