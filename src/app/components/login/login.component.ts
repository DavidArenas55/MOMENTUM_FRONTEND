import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RouterModule, Router } from '@angular/router';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardActions,
    MatCardContent,
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    MatError],
})
export class LoginComponent {
  loginForm: FormGroup;
  authService = inject(AuthService);

  @Output() loginSuccess = new EventEmitter<boolean>();

  constructor(private form: FormBuilder, private router: Router){
    this.loginForm = this.form.group({
      name_or_mail: ['Marcel', [Validators.required]],
      password: ['123456', [Validators.required, Validators.minLength(6)]], 
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          console.log('Usuario autenticado');
          this.loginSuccess.emit(true);
          this.router.navigate(['/dashboard']);
        },
        error: (err: any) => {
          console.error('Error en el inicio de sesión:', err);
        },
      });
    }
    else{
      alert("input values");
    }
  }
}
