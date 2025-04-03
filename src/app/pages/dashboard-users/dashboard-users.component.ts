import { Component, inject  } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton, MatFabButton, MatIconButton } from '@angular/material/button';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListOption, MatList, MatListModule  } from '@angular/material/list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CalendarsService } from '../../services/calendars.service';
import { Calendar } from '../../models/calendar.model';
import { BrowserModule } from '@angular/platform-browser';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { UP_ARROW } from '@angular/cdk/keycodes';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-dashboard-users',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatList,
    MatListModule,
    MatChipsModule,
    MatTableModule,
    MatIcon,
    MatFabButton,
    MatButton,
    MatPaginator,
    MatCheckboxModule,
    MatInput,
    FormsModule,
    MatSelectModule,
  ],
  templateUrl: './dashboard-users.component.html',
  styleUrl: './dashboard-users.component.scss',
  standalone: true,
})
export class DashboardUsersComponent {
  selectedUsers = new Set<Partial<User>>();
  authService = inject(AuthService);
  calendarService = inject(CalendarsService);
  dashboardForm: FormGroup;
  ElementData: User[] = [];
  displayedColumns: string[] = ['delete','name', '_id', 'age', 'mail', 'isDeleted'];
  dataSource: MatTableDataSource<User>;
  calendarForm: FormGroup;
  isCalendarFormOpen = false;
  editingCalendar: Calendar | null = null;
  editingUser: Partial<User> | null = null;
  originalUser: Partial<User> | null = null;
  userCalendars: Calendar[] = [];
  availableAppointments: string[] = [];
  newAppointment: string = '';

  constructor(private form: FormBuilder, private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar){
    this.dashboardForm = this.form.group({});
    this.dataSource = new MatTableDataSource();
    this.calendarForm = this.form.group({
      calendarName: ['', [Validators.required, Validators.minLength(3)]],
      owner: [''],
      Calendar_ID: [''],
      appointments: [[]],
      invitees: [[]],
      newAppointment: [''],
      isDeleted: [false]
    });
  }
  pageSize = 5;
  page = 0;
  length = 0;
  ngOnInit(): void {
    this.getPaginatedUsers();
  }

  getPaginatedUsers(): void {
    try {
      this.dataSource.data = [];
      this.authService.getUsers(this.page, this.pageSize).subscribe({
        next: (data: any) => {
          this.ElementData = data.users.map((user: any) => ({
            name: user.name,
            _id: user._id,
            age: user.age,
            mail: user.mail,
            isDeleted: user.isDeleted,
            password: user.password,
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
    this.openConfirmationDialog('delete').subscribe((confirmed) => {
      if (confirmed) {
        const selectedUsersId: string[] = Array.from(this.selectedUsers)
          .map(user => user._id)
          .filter((id): id is string => id !== undefined);

        this.authService.deleteUsers(selectedUsersId).subscribe({
          next: () => {
            this.selectedUsers.clear();
            this.getPaginatedUsers();
          },
          error: (err: any) => {
            console.error('Error deleting users:', err);
          },
        });
      }
    });
  }

  restoreUser(user: User): void {
    this.openConfirmationDialog('restore').subscribe((confirmed) => {
      if (confirmed) {
        this.authService.restoreUser(user._id!).subscribe({
          next: (response) => {
            console.log('User restored:', response);
            user.isDeleted = false;
            this.getPaginatedUsers();
          },
          error: (err) => {
            console.error('Error restoring user:', err);
            alert('Failed to restore the user');
          },
        });
      }
    });
  }

  editUser(user: User) {
    this.editingUser = JSON.parse(JSON.stringify(user));
    this.originalUser = JSON.parse(JSON.stringify(user));
    this.calendarService.getCalendars(user._id!).subscribe({
      next: (calendars) => {
        this.userCalendars = calendars.calendars;
      },
    })
  }
  getUserCalendars(user: User): void {
    this.calendarService.getCalendars(user._id!).subscribe({
      next: (calendars) => this.userCalendars = calendars.calendars,
      error: (err) => console.error('Error fetching calendars:', err),
    });
  }

  editCalendar(calendar: Calendar): void {
    this.editingCalendar = calendar;
    this.calendarForm.patchValue(calendar);
    this.isCalendarFormOpen = true;
  }

  saveCalendar(): void {
    if (this.calendarForm.invalid) {
      return;
    }
    
    // Obtén los valores directamente del form
    const formValues = this.calendarForm.value;
    console.log('Datos enviados al servidor:', JSON.stringify(formValues, null, 2));
    console.log('Enviando appointments:', formValues.appointments);
    
    const calendarData: Partial<Calendar> = {
      calendarName: formValues.calendarName,
      appointments: formValues.appointments || [],
      invitees: formValues.invitees || [],
      owner: this.editingUser?._id,
    };
    console.log('Datos enviados al servidor:', JSON.stringify(calendarData, null, 2));
    if (this.editingCalendar) {
      this.calendarService.editCalendar(this.editingCalendar._id, calendarData).subscribe({
        next: () => this.reloadUserCalendars(),
        error: (err) => console.error('Error al editar calendario:', err)
      });
    } else {
      this.calendarService.createCalendar(calendarData).subscribe({
        next: () => this.reloadUserCalendars(),
        error: (err) => console.error('Error al crear calendario:', err)
      });
    }
    
    this.closeCalendarForm();
  }
  
  // Método auxiliar para recargar calendarios
  private reloadUserCalendars(): void {
    if (this.editingUser && this.editingUser._id) {
      this.getUserCalendars(this.editingUser as User);
    }
  }


  closeCalendarForm(): void {
    this.editingCalendar = null;
    this.isCalendarFormOpen = false;
    this.calendarForm.patchValue({
      calendarName: ""
    });
  }

  deleteCalendar(calendarId: string): void {
    this.calendarService.deleteCalendar(calendarId).subscribe({
      next: () => {
        if (this.editingUser && this.editingUser._id && this.editingUser.name) {
          this.getUserCalendars(this.editingUser as User);
        }
      },
      error: (err) => console.error('Error deleting calendar:', err),
    });
  }

  addAppointment(): void {
    const newAppValue = this.calendarForm.get('newAppointment')?.value;
    if (newAppValue && newAppValue.trim()) {
      const currentAppointments = this.calendarForm.get('appointments')?.value || [];
      if (!this.availableAppointments.includes(newAppValue.trim())){
        this.calendarForm.get('appointments')?.setValue([...currentAppointments, newAppValue.trim()]);
        this.availableAppointments = [...this.availableAppointments, newAppValue.trim()];
        this.calendarForm.get('newAppointment')?.setValue('');
        
        console.log('Appointments actualizados:', this.calendarForm.get('appointments')?.value);
      }{
        
      }
    }
  }

  removeAppointment(appointment: string): void {
  const currentAppointments = this.calendarForm.get('appointments')?.value || [];
  const updatedAppointments = currentAppointments.filter((a: string) => a !== appointment);
  this.calendarForm.get('appointments')?.setValue(updatedAppointments);
  this.availableAppointments = updatedAppointments;
  
  console.log('Appointments después de eliminar:', this.calendarForm.get('appointments')?.value);
  }

  addInvitee(invitee: string): void {
    const currentInvitees = this.calendarForm.value.invitees;
    this.calendarForm.patchValue({ invitees: [...currentInvitees, invitee] });
  }

  removeInvitee(invitee: string): void {
    this.calendarForm.patchValue({
      invitees: this.calendarForm.value.invitees.filter((i: string) => i !== invitee),
    });
  }

  selectUser(user: User) {
    this.editingUser = JSON.parse(JSON.stringify(user));
    this.originalUser = JSON.parse(JSON.stringify(user));
  }

  cancelEditing() {
    this.editingUser =  JSON.parse(JSON.stringify(this.originalUser));
  }

  saveUser() {
    if (!this.editingUser || !this.editingUser._id || !this.originalUser) {
      return;
    }
  
    // Create object with only changed fields
    const updatedData: Partial<User> = {};
  
    // Compare each editable field
    if (this.editingUser.name !== this.originalUser.name) {
      updatedData.name = this.editingUser.name;
    }
    if (this.editingUser.age !== this.originalUser.age) {
      updatedData.age = this.editingUser.age;
    }
    if (this.editingUser.mail !== this.originalUser.mail) {
      updatedData.mail = this.editingUser.mail;
    }
    if (this.editingUser.password && this.editingUser.password !== '') {
      updatedData.password = this.editingUser.password;
    }
  
    // Only proceed if there are actual changes
    if (Object.keys(updatedData).length === 0) {
      this.editingUser = null;
      return;
    }
  
    console.log('Updating fields:', updatedData);
    
    this.authService.userUpdate(this.editingUser._id, updatedData).subscribe({
      next: (updatedUser) => {
        console.log('User updated:', updatedUser);
        this.showSuccess('User updated successfully');
        this.editingUser = null;
        this.getPaginatedUsers();
      },
      error: (error) => {
        console.error('Error updating user:', error);
          this.showError("Error Updating User");
          this.editingUser =  JSON.parse(JSON.stringify(this.originalUser));
      }
    });
  }

  extractAppointments(): void {
    this.availableAppointments = this.userCalendars.flatMap(calendar => calendar.appointments);
  }

  // FINESTRES CONFIRM ERROR
  private showError(message: string, duration: number = 5000): void {
    this.snackBar.open(message, 'Close', {
      duration: duration,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
  
  private showSuccess(message: string): void {
    // Example using MatSnackBar (you'll need to inject MatSnackBar)
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  openConfirmationDialog(action: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    return dialogRef.afterClosed();
  }
}

