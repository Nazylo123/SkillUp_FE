import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiDashboardServices } from '../../../services/dashboard.service';
import { LecturerDashboardDto } from '../../../models/dashboard.models';

@Component({
  selector: 'app-lecturer-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lecturer-dashboard.component.html',
  styleUrls: ['./lecturer-dashboard.component.scss']
})
export class LecturerDashboardComponent implements OnInit {
  data?: LecturerDashboardDto;

  constructor(private dashboardService: ApiDashboardServices) {}

  ngOnInit() {
    this.dashboardService.getLecturerDashboard().subscribe({
      next: (res) => {
        this.data = res;
      },
      error: (err) => {
        console.error('Error fetching lecturer dashboard', err);
      }
    });
  }
}
