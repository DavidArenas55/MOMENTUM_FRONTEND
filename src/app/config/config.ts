import { InjectionToken } from '@angular/core';

export type Config = {
  apiUrl: string;
};

export const APP_CONFIG: InjectionToken<Config> = new InjectionToken<Config>(
  'Application Config'
);
