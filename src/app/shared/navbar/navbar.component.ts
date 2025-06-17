import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../services/auth.service'; // Asegúrate de que la ruta sea correcta
import { tap } from 'rxjs/operators';
import { inject } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,           // For *ngIf
    MatToolbarModule,       // For mat-toolbar
    MatIconModule,          // For mat-icon
    MatButtonModule         // For mat-icon-button
  ],
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isLoggedIn = true;
  private authService = inject(AuthService);
  public router = inject(Router);

  constructor() {}

  logout() {
    this.authService.logout().pipe(
      tap(() => {
        // Aquí se elimina el access token del localStorage y se limpia la cookie en el backend
        this.router.navigate(['auth/login']);
      })
    ).subscribe({
      error: (err: unknown): void => {
        console.error('Error al realizar logout:', err);
        // En caso de error, igualmente redirigimos al login
        this.router.navigate(['auth/login']);
      }
    });
  }

}

