import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

export interface UsersFormat {
  name: string;
  id: string;
  age: number;
  mail: string;
  isDeleted: boolean;
}

@Component({
  selector: 'app-dashboard',
  imports: [ReactiveFormsModule, MatTableModule ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone: true,
})
export class DashboardComponent {
  authService = inject(AuthService);
  dashboardForm: FormGroup;
  ElementData: UsersFormat[] = [];
  displayedColumns: string[] = ['name', 'id', 'age', 'mail', 'isDeleted'];
  dataSource: MatTableDataSource<UsersFormat>;
  constructor(private form: FormBuilder, private router: Router){
    this.dashboardForm = this.form.group({});
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit():void {
    try{
      this.authService.getUsers().subscribe({
        next: (data: any) => {
          this.ElementData = data.users.map((user: any) => ({
            name: user.name,
            id: user._id,
            age: user.age,
            mail: user.mail,
            isDeleted: user.isDeleted
          }));
          console.log(this.ElementData);
          this.dataSource.data = this.ElementData;
        },
        error: (error: any) => {
          console.error('Error fetching users:', error);
          alert("Error fetching users");
        }
      });
    }
    catch(e){
      console.error('Error obtaining users', e);
    }
  }
}
