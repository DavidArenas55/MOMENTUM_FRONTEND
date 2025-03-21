import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { RegisterService } from '../../services/register.service';
import { RouterModule, Router } from '@angular/router';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { DialogComponent } from '../../shared/dialog/dialog.component';

@Component({
  selector: 'app-register',
  imports: [CommonModule,ReactiveFormsModule,RouterModule,MatCard,MatCardHeader,MatCardTitle,MatCardActions,MatCardContent,MatButton,MatFormField,MatInput,MatLabel,MatError, MatIcon],
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  
  formRegister: FormGroup;
  registerService = inject(RegisterService);
  
  constructor(private form: FormBuilder,  private router: Router, private dialog: MatDialog){
    this.formRegister = this.form.group({
      name: [''],
      age: [''],
      mail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordVerification: ['', [Validators.required]],
    }, { validators: this.passwordMatchValidator });  // verifiquem que la password i la passwordVerification siguin iguals
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const passwordVerification = control.get('passwordVerification')?.value;
    if (!password || !passwordVerification) {
      return null;
    }
    return password !== passwordVerification ? { passwordMismatch: true } : null;
  }

  onSubmit(){
    if (this.formRegister.valid) {
      this.registerService.register(this.formRegister.value).subscribe({
        next: () => {
          console.log('Correo enviado al usuario!');
          this.formRegister.reset();
          this.openDialog('Éxito', '¡Revisa tu correo para finalizar el registro!').subscribe(() => {
            this.router.navigate(['/auth/login']);
          });
          
          
        },
        error: (err: any) => {
          if(err.status === 409){
            this.openDialog('Error', '¡El nombre/correo ya existe!');
            console.log("User ya existe")
            this.formRegister.patchValue({mail: ''});
          }
          else{
            this.openDialog('Error', 'Hubo un problema con la petición. Por favor, intenta de nuevo más tarde.');
            console.error('Error en el envio de mail:', err);
          }    
          this.formRegister.reset();
        },
      });
    }
    else{
      alert("Revisa los campos y si las contraseñas coinciden");
    }
  }

  openDialog(title: string, message: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { title, message }
    });
    return dialogRef.afterClosed();
  }
}
