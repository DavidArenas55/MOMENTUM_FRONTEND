import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes'; // Importa les rutes definides abans
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { authInterceptor } from './services/auth.interceptor';
import { APP_CONFIG } from './config/config';

export async function getAppConfig(): Promise<ApplicationConfig> {
  const config = await fetch('./config.json').then(resp => resp.json());
  return {
    providers: [
      provideRouter(routes),
      provideZoneChangeDetection({ eventCoalescing: true }),
      provideRouter(routes),
      provideHttpClient(withInterceptors([authInterceptor])),
      { provide: APP_CONFIG, useValue: config },
    ]
  };
}
