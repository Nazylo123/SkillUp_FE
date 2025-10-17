import { Component, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import {
    ApexAxisChartSeries,
    ApexChart,
    ChartComponent,
    ApexDataLabels,
    ApexPlotOptions,
    ApexYAxis,
    ApexLegend,
    ApexTooltip,
    ApexGrid,
    ApexTitleSubtitle,
    ApexXAxis,
    ApexFill,
    NgApexchartsModule
} from "ng-apexcharts";
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatProgressBar } from "@angular/material/progress-bar";

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    tooltip: ApexTooltip;
    plotOptions: ApexPlotOptions;
    yaxis: ApexYAxis;
    grid: ApexGrid;
    legend: ApexLegend;
    colors: any;
    xaxis: ApexXAxis;
    fill: ApexFill;
    title: ApexTitleSubtitle;
};

@Component({
    selector: 'app-manager-user-detail',
    imports: [MatCardModule, MatButtonModule, MatMenuModule, ChartComponent, MatCheckboxModule, MatTableModule, MatProgressBar, MatPaginatorModule],
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.scss']
})
export class ManagerUserDetail {

    displayedColumns: string[] = ['name', 'startDate', 'deadline', 'progress'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

    @ViewChild("chart") chart!: ChartComponent;
    public chartOptions: Partial<ChartOptions>;

    constructor() {
        this.chartOptions = {
            series: [
                {
                    name: "Total Revenue",
                    data: [16, 12, 18, 14, 11, 9, 17, 15, 10, 7, 10, 5]
                }
            ],
            chart: {
                height: 270,
                type: "bar",
                toolbar: {
                    show: false,
                }
            },
            plotOptions: {
                bar: {
                    columnWidth: "18%",
                    distributed: true
                },
            },
            dataLabels: {
                enabled: false
            },
            colors: ["#90C6E0"],
            xaxis: {
                categories: [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec"
                ],
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                },
                labels: {
                    style: {
                        colors: "#a9a9c8",
                        fontSize: "14px"
                    },
                },
            },
            yaxis: {
                tickAmount: 4,
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                },
                labels: {
                    show: true,
                    style: {
                        colors: "#a9a9c8",
                        fontSize: "14px"
                    },
                }
            },
            grid: {
                show: true,
                borderColor: "#EDEFF5",
                strokeDashArray: 5,
            },
            legend: {
                offsetY: 5,
                show: false,
                position: "bottom",
                fontSize: "14px",
                horizontalAlign: "center",
                labels: {
                    colors: '#5B5B98'
                }
            },
            tooltip: {
                y: {
                    formatter: function(val) {
                        return "$" + val + "K";
                    }
                }
            }
        };
    }

    active = true;
    pending = true;
    completed = true;

}

export interface PeriodicElement {
    deadline: string;
    name: string;
    startDate: string;
    progress: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    name: 'Public Beta Release',
    startDate: '10 Mar 2023',
    deadline: '14 Mar 2023',
    progress: 75
  },
  {
    name: 'Fix Platform Errors',
    startDate: '09 Feb 2023',
    deadline: '12 Feb 2023',
    progress: 100
  },
  {
    name: 'Launch our Mobile App',
    startDate: '03 Mar 2023',
    deadline: '10 Mar 2023',
    progress: 60
  },
  {
    name: 'Add the New Pricing Page',
    startDate: '02 Mar 2023',
    deadline: '08 Mar 2023',
    progress: 80
  },
  {
    name: 'Redesign New Online Shop',
    startDate: '25 Feb 2023',
    deadline: '01 Mar 2023',
    progress: 45
  },
  {
    name: 'Material Ui Design',
    startDate: '02 Apr 2023',
    deadline: '03 Apr 2023',
    progress: 30
  },
  {
    name: 'Add Progress Track',
    startDate: '01 Feb 2023',
    deadline: '12 Feb 2023',
    progress: 100
  },
  {
    name: 'Project for Client',
    startDate: '10 Mar 2023',
    deadline: '14 Mar 2023',
    progress: 70
  },
  {
    name: 'Opened New Showcase',
    startDate: '05 Feb 2023',
    deadline: '28 Feb 2023',
    progress: 100
  },
  {
    name: 'Updated the Status',
    startDate: '05 Mar 2023',
    deadline: '10 Mar 2023',
    progress: 95
  },
  {
    name: 'Product UI/UX Design',
    startDate: '05 Mar 2023',
    deadline: '08 Mar 2023',
    progress: 85
  },
  {
    name: 'Product Development',
    startDate: '20 Feb 2023',
    deadline: '28 Feb 2023',
    progress: 50
  },
  {
    name: 'New Office Building',
    startDate: '01 Apr 2023',
    deadline: '03 Apr 2023',
    progress: 65
  },
  {
    name: 'SEO Marketing',
    startDate: '27 Feb 2023',
    deadline: '01 Mar 2023',
    progress: 40
  },
  {
    name: 'Public Beta Release',
    startDate: '10 Mar 2023',
    deadline: '14 Mar 2023',
    progress: 75
  },
  {
    name: 'Fix Platform Errors',
    startDate: '09 Feb 2023',
    deadline: '12 Feb 2023',
    progress: 100
  }
];
