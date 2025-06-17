import { Component } from '@angular/core';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { LoginComponent } from '../../pages/login/login.component';


@Component({
  selector: 'app-inicio',
  imports: [
    RouterModule,
    MatButtonToggleModule, 
    ReactiveFormsModule,
    MatButtonModule, 
    MatMenuModule],
  standalone: true,
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  inicioForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.inicioForm = this.formBuilder.group({
      value: ['', Validators.required],
    });
  }
}
