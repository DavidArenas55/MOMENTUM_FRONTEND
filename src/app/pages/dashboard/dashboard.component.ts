import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconButton } from '@angular/material/button';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';
import { MatCheckboxModule } from '@angular/material/checkbox';

export interface UsersFormat {
  name: string;
  id: string;
  age: number;
  mail: string;
  isDeleted: boolean;
}

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatIcon,
    MatToolbar,
    MatIconButton,
    MatPaginator,
    MatCheckboxModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: true,
})
export class DashboardComponent {
  selectedUsers = new Set<Partial<User>>();
  authService = inject(AuthService);
  dashboardForm: FormGroup;
  ElementData: UsersFormat[] = [];
  displayedColumns: string[] = ['delete','name', 'id', 'age', 'mail', 'isDeleted'];
  dataSource: MatTableDataSource<UsersFormat>;
  constructor(private form: FormBuilder, private router: Router){
    this.dashboardForm = this.form.group({});
    this.dataSource = new MatTableDataSource();
  }

  pageSize = 5;
  page = 0;
  length = 0;

  ngOnInit(): void {
    this.getPaginatedUsers();
  }

  getPaginatedUsers(): void {
    try{
      this.authService.getUsers(this.page, this.pageSize).subscribe({
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
          this.length = data.totalUsers;
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

  handlePageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.page = event.pageIndex;
    this.getPaginatedUsers();
  }


  toggleSelection(user: User, event: any) {
    if (event.checked) {
      this.selectedUsers.add(user);
    } else {
      this.selectedUsers.delete(user);
    }
  }

  toggleSelectAll(event: any) {
    if (event.checked) {
      this.dataSource.data.filter(user => !user.isDeleted).forEach(user => this.selectedUsers.add(user));
    } else {
      this.selectedUsers.clear();
    }
  }

  isAllSelected(): boolean {
    return this.dataSource.data.every(user => this.selectedUsers.has(user));
  }

  isIndeterminate(): boolean {
    return this.selectedUsers.size > 0 && this.selectedUsers.size < this.dataSource.data.length;
  }

  isSelected(user: User): boolean {
    return this.selectedUsers.has(user);
  }

  deleteSelected() {
    const selectedUsersMail: string[] = Array.from(this.selectedUsers).map(user => user.mail).filter((mail): mail is string => mail !== undefined);
    console.log(selectedUsersMail);
    this.authService.deleteUsers(selectedUsersMail).subscribe({
      next: () => {
        this.selectedUsers.clear();
        this.getPaginatedUsers();
      },
      error: (err: any) => {
        console.error('Error en el inicio de sesión:', err);
      },
    });
  }
}
