import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { Business } from '../../../models/business.model';
import { Location } from '../../../models/location.model';
import { WorkerListComponent } from '../worker-list/worker-list.component';
import { BusinessService } from '../../../services/businesses.service';

@Component({
  selector: 'app-location-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    WorkerListComponent,
  ],
  templateUrl: './location-list.component.html',
  styleUrl: './location-list.component.scss'
})
export class LocationListComponent {
  businessService = inject(BusinessService);
  business = input<Business>();
  closeWindow = output();
  dataSource: MatTableDataSource<Location>
  selectedLocation: Location | undefined = undefined;
  displayedColumns = ['nombre', 'delete'];

  constructor() {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
      this.dataSource.data = this.business()?.location as Location[];
  }

  selectLocation(location: Location) {
    this.selectedLocation = location;
  }

  deleteLocation(location: Location) {
    try {
      const b = this.business();
      if (!b) return;

      const index = b.location.findIndex((l) => l._id === location._id);
      if (index < 0) return;
      const id = b.location?.at(index)?._id
      if (!id) return;
      this.businessService.deleteLocation(id).subscribe({
        next: () => {
          b.location.at(index)!.isDeleted = true;
          this.dataSource.data = b.location;
          // Optionally clear selection if deleted location was selected
          if (this.selectedLocation?._id === location._id) {
            this.selectedLocation = undefined;
          }
        },
        error: () => {
          alert("Failed to delete location");
        }
      });
    } catch {
      alert("Failed to delete location");
    }
  }

  restoreLocation(location: Location) {
    try {
      const b = this.business();
      if (!b) return;

      const index = b.location.findIndex((l) => l._id === location._id);
      if (index < 0) return;
      const id = b.location?.at(index)?._id
      if (!id) return;
      this.businessService.restoreLocation(id).subscribe({
        next: () => {
          b.location.at(index)!.isDeleted = false;
          this.dataSource.data = b.location;
          // Optionally clear selection if deleted location was selected
          if (this.selectedLocation?._id === location._id) {
            this.selectedLocation = undefined;
          }
        },
        error: () => {
          alert("Failed to restore location");
        }
      });
    } catch {
      alert("Failed to restore location");
    }
  }
}
