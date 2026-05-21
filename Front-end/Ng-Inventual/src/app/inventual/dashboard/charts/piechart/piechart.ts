import { Component, ViewChild, ViewEncapsulation } from '@angular/core';

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-piechart',
  imports: [NgApexchartsModule],
  templateUrl: './piechart.html',
  styleUrl: './piechart.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Piechart {
  @ViewChild('chart4') chart: ChartComponent | undefined;
  public chartOptions: Partial<ChartOptions> | any;

  constructor() {
    this.chartOptions = {
      series: [44, 55, 13, 43],
      chart: {
        width: 350,
        type: 'pie',
      },
      labels: ['Purchase', 'Sales', 'Expense', 'Gross Profit'],
      responsive: [
        {
          breakpoint: 575,
          options: {
            chart: {
              width: 350,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
        {
          breakpoint: 400,
          options: {
            chart: {
              width: 300,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
        {
          breakpoint: 350,
          options: {
            chart: {
              width: 280,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
  }
}
