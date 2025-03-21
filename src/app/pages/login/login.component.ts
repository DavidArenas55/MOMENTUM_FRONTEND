import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RouterModule, Router } from '@angular/router';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

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
    MatIcon,
    MatError],
})
export class LoginComponent {
  loginForm: FormGroup;
  authService = inject(AuthService);


  constructor(private form: FormBuilder, private router: Router,  private dialog: MatDialog){
    this.loginForm = this.form.group({
      name_or_mail: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]], 
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          console.log('Usuario autenticado');
          this.router.navigate(['/dashboard/users']);
        },
        error: (err: any) => {
          console.error('Error en el inicio de sesión:', err);
          if (err.status === 401) {
            this.openDialog('Error', 'Contraseña o usuario incorrecto');
            this.loginForm.reset(); 
          } else {
            this.openDialog('Error', 'Hubo un problema con la petición. Por favor, intenta de nuevo más tarde.');
            this.loginForm.reset(); 
          }
        },
      });
    } else {
      alert("Los campos son obligatorios.");
    }
  }

  openDialog(title: string, message: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { title, message }
    });
    return dialogRef.afterClosed();
  }
}
