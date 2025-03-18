import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MatButton,  } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar'; 

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
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isLoggedIn = true;

  constructor(public router: Router) {}

  logout() {
    this.router.navigate(['/login']);
  }

}
