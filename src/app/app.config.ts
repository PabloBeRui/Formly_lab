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
    // Configuración unificada según la doc v7
    provideFormlyCore(withFormlyBootstrap(), ),
  ],
};
