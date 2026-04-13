import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { withFormlyBootstrap } from '@ngx-formly/bootstrap';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideFormlyCore } from '@ngx-formly/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // Configuración unificada según formly v7: primero el tema Bootstrap y luego mensajes globales.
    provideFormlyCore([
      ...withFormlyBootstrap(),
      {
        validationMessages: [
          { name: 'required', message: 'Este campo es obligatorio' },
          { name: 'pattern', message: 'El formato no es válido' },
          { name: 'email', message: 'El correo electrónico no es válido' },
        ],
      },
    ]),
  ],
};
