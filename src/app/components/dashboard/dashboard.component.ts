import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { CalendarsService } from '../../services/calendars.service';
import { Calendar } from '../../models/calendar.model';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatListOption,
    MatSelectionList,
    MatTableModule,
    MatIcon,
    MatToolbar,
    MatIconButton,
    MatButton,
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
  calendarService = inject(CalendarsService);
  dashboardForm: FormGroup;
  ElementData: User[] = [];
  displayedColumns: string[] = ['delete','name', '_id', 'age', 'mail', 'isDeleted'];
  dataSource: MatTableDataSource<User>;
  constructor(private form: FormBuilder, private router: Router){
    this.dashboardForm = this.form.group({});
    this.dataSource = new MatTableDataSource();
  }

  pageSize = 5;
  page = 0;
  length = 0;

  editingUser: User | null = null;
  userCalendars: Calendar[] = [];

  ngOnInit(): void {
    this.getPaginatedUsers();
  }

  getPaginatedUsers(): void {
    try {
      this.authService.getUsers(this.page, this.pageSize).subscribe({
        next: (data: any) => {
          this.ElementData = data.users.map((user: any) => ({
            name: user.name,
            _id: user._id, // Keep the same naming as your model
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
          alert('Error fetching users');
        }
      });
    } catch (e) {
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
    const selectedUsersId: string[] = Array.from(this.selectedUsers)
    .map(user => user._id)
    .filter((id): id is string => id !== undefined);
    this.authService.deleteUsers(selectedUsersId).subscribe({
      next: () => {
        this.selectedUsers.clear();
        this.getPaginatedUsers();
      },
      error: (err: any) => {
        console.error('Error en el inicio de sesión:', err);
      },
    });
  }

  editUser(user: User) {
    this.editingUser = user;
    this.calendarService.getCalendars(user._id!).subscribe({
      next: (calendars) => {
        this.userCalendars = calendars.calendars;
      },
    })
  }
}
