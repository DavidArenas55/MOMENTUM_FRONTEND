import { Component } from '@angular/core';
import { MatNavList } from '@angular/material/list';
import { MatDrawerContainer, MatDrawerContent, MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterModule,  NavbarComponent, FooterComponent, MatSidenavModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {
  constructor(private router: Router){}

  logout() {
    // Add your logout logic here
    console.log('User logged out');
    this.router.navigate(['/auth/login']);
  }

}
