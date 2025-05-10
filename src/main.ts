import { bootstrapApplication } from '@angular/platform-browser';
import { getAppConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { ApplicationConfig } from '@angular/core';

getAppConfig().then((appConfig: ApplicationConfig) => {
  bootstrapApplication(AppComponent, appConfig)
    .catch((err) => console.error(err));
})
