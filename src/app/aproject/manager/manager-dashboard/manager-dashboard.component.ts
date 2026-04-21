import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcUserOverviewComponent } from "./ac-user-overview/ac-user-overview.component";
import { AcUserStatusComponent } from "./ac-user-status/ac-user-status.component";
import { AcStatsComponent } from "./ac-stats/ac-stats.component";
import { ApiDashboardServices } from '../../../services/dashboard.service';
import { AcEmployeeComponent } from "./ac-employee/ac-employee.component";
import { AcBoardComponent } from "./ac-board/ac-board.component";
import { LecturerStatDto } from '../../../models/dashboard.models';

@Component({
    selector: 'app-manager-dashboard',
    imports: [CommonModule, AcStatsComponent, AcEmployeeComponent, AcBoardComponent],
    templateUrl: './manager-dashboard.component.html',
    styleUrls: ['./manager-dashboard.component.scss']
})
export class ManagerDashboard implements OnInit {

    data:any;
    managerKpi: LecturerStatDto[] = [];

    constructor(private dashboardService: ApiDashboardServices) {}

    ngOnInit() {
        this.dashboardService.getManagerDashboardStats().subscribe({
            next: (res) => {
                this.data = res;
            },
            error: (error) => {
                this.data = null;
            }
        });

        this.dashboardService.getManagerLecturerStats().subscribe({
            next: (res) => {
                if (res && res.lecturers) {
                    this.managerKpi = res.lecturers;
                }
            },
            error: (error) => {
                console.error('Error fetching lecturer stats', error);
            }
        });
    }
}