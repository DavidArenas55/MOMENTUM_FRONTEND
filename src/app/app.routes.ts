import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { InicioComponent } from './shared/inicio/inicio.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardUsersComponent } from './pages/dashboard-users/dashboard-users.component';
import { DashboardAppointmentsComponent } from './pages/dashboard-appointments/dashboard-appointments.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent }
    ]
  },
  {
    path: 'dashboard',
    component: MainLayoutComponent,
    children: [
      { path: 'users', component: DashboardUsersComponent },
      { path: 'appointments', component: DashboardAppointmentsComponent }
    ]
  },
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' }
];
