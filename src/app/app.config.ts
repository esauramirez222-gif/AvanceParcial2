import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeEsMx from '@angular/common/locales/es-MX';

import { routes } from './app.routes';

// Fechas y moneda en español de México (pipes date y currency)
registerLocaleData(localeEsMx);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Al cambiar de ruta se regresa al inicio de la página y se respetan los #anclas.
    // withViewTransitions() anima el cambio entre pantallas (si el navegador lo soporta).
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }),
      withViewTransitions({
        skipInitialTransition: true,
        // Si la pestaña está en segundo plano o se navega muy rápido, el navegador cancela
        // la animación; se omite y se ignora ese aviso para no llenar la consola de errores.
        onViewTransitionCreated: ({ transition }) => {
          if (document.hidden) transition.skipTransition();
          transition.ready.catch(() => {});
          transition.finished.catch(() => {});
        },
      }),
    ),
    { provide: LOCALE_ID, useValue: 'es-MX' },
  ],
};
