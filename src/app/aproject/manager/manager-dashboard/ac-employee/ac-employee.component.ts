import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import {
    ApexAxisChartSeries,
    ApexChart,
    ChartComponent,
    ApexDataLabels,
    ApexPlotOptions,
    ApexYAxis,
    ApexAnnotations,
    ApexFill,
    ApexStroke,
    ApexGrid,
    NgApexchartsModule
} from "ng-apexcharts";
import { ApiDashboardServices } from "../../../../services/dashboard.service";
import { MatFormField } from "@angular/material/form-field";
import { MatLabel } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { FormsModule } from "@angular/forms";
import { MatOption } from "@angular/material/core";
import { MatSelect } from "@angular/material/select";

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    yaxis: ApexYAxis;
    xaxis: any; //ApexXAxis;
    annotations: ApexAnnotations;
    fill: ApexFill;
    stroke: ApexStroke;
    grid: ApexGrid;
};

@Component({
    selector: 'app-ac-employee',
    imports: [NgApexchartsModule, MatFormField, MatLabel, MatIconModule, FormsModule, MatOption, MatSelect],
    templateUrl: './ac-employee.component.html',
    styleUrls: ['./ac-employee.component.scss']
})
export class AcEmployeeComponent {
    @ViewChild("chart") chart!: ChartComponent;
    @Input() selectedYear: string = '';
    years: string[] = [];
    data: any[] = [];
    public chartOptions: Partial<ChartOptions>;

    constructor(private dashboardService: ApiDashboardServices) {
        const currentYear = new Date().getFullYear();
        this.selectedYear = currentYear.toString();
        for (let year = 2024; year <= currentYear; year++) {
          this.years.push(year.toString());
        }

        this.chartOptions = {
            series: [],
            chart: {
                height: 350,
                type: "bar",
            },
        };
    }

    ngOnInit() {
        this.getMonthlyEnrollmentStats();
    }

    getMonthlyEnrollmentStats() {
        this.dashboardService.getManagerDashboardMonthlyEnrollmentStats().subscribe((res: any) => {
            console.log(res);
            this.data = res.monthlyEnrollmentStats.map((item: any) => item.newEnrollments);
            console.log(this.data);
            this.setup();
        });
    }

    setup() {
        this.chartOptions = {
            series: [
                {
                    name: "Employee Count",
                    data: this.data
                }
            ],
            chart: {
                height: 350,
                type: "bar",
                toolbar: {
                    show: true
                },
                zoom: {
                    enabled: false
                }
            },
            plotOptions: {
                bar: {
                    columnWidth: "50%",
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                width: 2
            },
            grid: {
                row: {
                    colors: ["#ffffff", "#f2f2f2"]
                },
                show: true,
                strokeDashArray: 5,
                borderColor: "#EDEFF5"
            },
            xaxis: {
                labels: {
                    rotate: -45,
                    style: {
                        colors: "#a9a9c8",
                        fontSize: "14px",
                    }
                },
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
                tickPlacement: "on"
            },
            yaxis: {
                title: {
                    text: "Employee Count"
                },
                labels: {
                    style: {
                        colors: "#a9a9c8",
                        fontSize: "14px",
                    }
                },
                axisBorder: {
                    show: false
                }
            },
            fill: {
                type: "gradient",
                gradient: {
                    shade: "light",
                    type: "horizontal",
                    shadeIntensity: 0.25,
                    gradientToColors: undefined,
                    inverseColors: true,
                    opacityFrom: 0.85,
                    opacityTo: 0.85
                }
            }
        };
    }


}