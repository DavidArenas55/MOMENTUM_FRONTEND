import { Component, Input } from '@angular/core';
import { Location } from '../../../models/location.model';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-worker-list',
  templateUrl: './worker-list.component.html',
  styleUrls: ['./worker-list.component.css'],
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatDividerModule,
    MatToolbarModule,
  ]
})
export class WorkerListComponent {
  @Input() location?: Location;

  displayedColumns: string[] = ['name', 'age', 'mail', 'role'];
}
