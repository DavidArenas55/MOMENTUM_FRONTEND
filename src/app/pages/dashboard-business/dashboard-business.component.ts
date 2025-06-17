import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Business } from '../../models/business.model';
import { FormBuilder } from '@angular/forms';
import { BusinessService } from '../../services/businesses.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { WorkerListComponent } from "./worker-list/worker-list.component";
import { LocationListComponent } from './location-list/location-list.component';

@Component({
  selector: 'app-dashboard-business',
  imports: [
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    LocationListComponent,
],
  templateUrl: './dashboard-business.component.html',
  styleUrl: './dashboard-business.component.scss'
})
export class DashboardBusinessComponent {
  businessService = inject(BusinessService);
  dataSource: MatTableDataSource<Business>;
  selectedBusinesses = new Set<Business>();
  editingBusiness : Business | null = null;
  displayedColumns: string[] = ['delete','name', '_id', 'locations', 'isDeleted'];

  constructor(private form: FormBuilder, private dialog: MatDialog) {
    this.dataSource = new MatTableDataSource();
  }

  pageSize = 5;
  page = 0;
  length = 0;
  ngOnInit(): void {
    this.getBusinesses();
  }

  getBusinesses() {
    this.dataSource.data = [];
    this.businessService.getBusinesses(this.page, this.pageSize).subscribe({
      next: (data: {businesses: Business[]}) => {
        console.log(data);
        this.dataSource.data = data.businesses;
      },
      error: (error: unknown) => {
        console.error('Error fetching businesses ', error);
        alert('Error fetching businesses');
      }
    });
  }

  handlePageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.page = event.pageIndex;
    this.getBusinesses();
  }

  toggleSelection(business: Business, event: any) {
    if (event.checked) {
      this.selectedBusinesses.add(business);
    } else {
      this.selectedBusinesses.delete(business);
    }
  }

  toggleSelectAll(event: any) {
    if (event.checked) {
      this.dataSource.data.filter(business => !business.isDeleted).forEach(business => this.selectedBusinesses.add(business));
    } else {
      this.selectedBusinesses.clear();
    }
  }

  isAllSelected(): boolean {
    return this.dataSource.data.every(business => this.selectedBusinesses.has(business));
  }

  isIndeterminate(): boolean {
    return this.selectedBusinesses.size > 0 && this.selectedBusinesses.size < this.dataSource.data.length;
  }

  isSelected(business: Business): boolean {
    return this.selectedBusinesses.has(business);
  }

  deleteSelected() {
    this.openConfirmationDialog('delete').subscribe((confirmed) => {
      if (confirmed) {
        const selectedBusinessesId: string[] = Array.from(this.selectedBusinesses)
          .map(business => business._id)
          .filter((id): id is string => id !== undefined);

        this.businessService.deleteBusinesses(selectedBusinessesId).subscribe({
          next: () => {
            this.selectedBusinesses.clear();
            this.getBusinesses();
          },
          error: (err: any) => {
            console.error('Error deleting businesses:', err);
          },
        });
      }
    });
  }

  restoreBusiness(business: Business): void {
    this.openConfirmationDialog('restore').subscribe((confirmed) => {
      if (confirmed) {
        this.businessService.restoreBusiness(business._id!).subscribe({
          next: (response) => {
            console.log('Business restored:', response);
            business.isDeleted = false;
            this.getBusinesses();
          },
          error: (err) => {
            console.error('Error restoring business:', err);
            alert('Failed to restore the business');
          },
        });
      }
    });
  }

  openConfirmationDialog(action: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    return dialogRef.afterClosed();
  }

  editBusiness(business: Business | null) {
    this.editingBusiness = business;
  }
}
