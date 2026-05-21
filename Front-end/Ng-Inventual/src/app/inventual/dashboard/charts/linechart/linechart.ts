import { Component, ViewChild, ViewEncapsulation } from '@angular/core';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexGrid,
  ApexTitleSubtitle,
  ApexLegend,
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  colors: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-linechart',
  imports: [NgApexchartsModule],
  templateUrl: './linechart.html',
  styleUrl: './linechart.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Linechart {
  title = 'angular-charts-demo';
  @ViewChild('chartA') chart: ChartComponent | undefined;
  public chartOptions: Partial<ChartOptions> | any;
  public isRTL: boolean = false; // Set to true for right-to-left, false for left-to-right

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: 'Profit',
          data: [7, 9, 13, 11, 14, 6, 9, 7, 13, 15, 11, 20],
        },
        {
          name: 'Loss',
          data: [5, 11, 7, 13, 6, 8, 10, 16, 12, 7, 11, 16],
        },
      ],
      chart: {
        height: 380,
        width: 100 + '%',
        type: 'line',
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2,
        },
        toolbar: {
          show: false,
        },
      },
      colors: ['#2C6AE5', '#27DB8D'],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: 'smooth',
      },
      title: {
        text: 'Profit & Loss Overview',
        align: this.isRTL ? 'right' : 'left',
      },
      grid: {
        borderColor: '#f1f1f1',
      },
      markers: {
        size: 1,
      },
      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
      },
      yaxis: {
        min: 5,
        max: 20,
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    };
  }
}
