import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthService } from './auth/services/auth.service';
import { provideHttpClient } from '@angular/common/http';
import { ConfigService } from './common/services/config.service';
import { provideMonacoEditor } from 'ngx-monaco-editor-v2';

function initializeApp(configService: ConfigService, authService: AuthService) {
  return async () => {
    await configService.loadConfig();
    await authService.initializeAuthState();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigService, AuthService],
      multi: true
    },
    provideAnimationsAsync(),
    provideMonacoEditor()
  ],
};