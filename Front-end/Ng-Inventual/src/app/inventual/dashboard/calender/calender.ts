import { Component, ViewEncapsulation } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatCalendar } from '@angular/material/datepicker';

@Component({
  selector: 'app-calender',
  imports: [MatCalendar, MatCard],
  templateUrl: './calender.html',
  styleUrl: './calender.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Calender {
  selected: Date | null = null;
}
