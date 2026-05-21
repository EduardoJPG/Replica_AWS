import { Component, ViewEncapsulation } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ThemePalette } from '@angular/material/core';

export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}

@Component({
  selector: 'app-report-permission',
  imports: [MatCheckboxModule],
  templateUrl: './report-permission.html',
  styleUrl: './report-permission.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ReportPermission {
  //sidebar menu activation start
  menuSidebarActive: boolean = false;
  myfunction() {
    if (this.menuSidebarActive == false) {
      this.menuSidebarActive = true;
    } else {
      this.menuSidebarActive = false;
    }
  }
  //sidebar menu activation end

  //checkbox start
  task: Task = {
    name: 'Permission All',
    completed: false,
    color: 'primary',
  };
  isComplete: boolean = false;
  allComplete: boolean = false;
  oneComplete: boolean = false;
  twoComplete: boolean = false;
  threeComplete: boolean = false;
  fourComplete: boolean = false;
  fiveComplete: boolean = false;
  sixComplete: boolean = false;
  sevenComplete: boolean = false;
  eightComplete: boolean = false;
  nineComplete: boolean = false;
  tenComplete: boolean = false;
  elevenComplete: boolean = false;
  twelveComplete: boolean = false;
  thirteenComplete: boolean = false;
  fourteenComplete: boolean = false;
  fifteenComplete: boolean = false;

  disabled_condition = true;

  updateAllCompletee() {
    this.allComplete =
      this.task.subtasks != null &&
      this.task.subtasks.every((t) => t.completed);
  }
  someComplete(): boolean {
    if (this.task.subtasks == null) {
      return false;
    }
    return (
      this.task.subtasks.filter((t) => t.completed).length > 0 &&
      !this.allComplete
    );
  }

  setAllABC(completed: boolean) {
    this.isComplete = completed;
    this.allComplete = completed;
    if (this.task.subtasks == null) {
      return;
    }
    this.task.subtasks.forEach((t) => (t.completed = completed));
  }

  setSingleCheckA2(completed: boolean) {
    this.oneComplete = completed;
  }
  setSingleCheckB2(completed: boolean) {
    this.twoComplete = completed;
  }
  setSingleCheckC2(completed: boolean) {
    this.threeComplete = completed;
  }
  setSingleCheckD2(completed: boolean) {
    this.fourComplete = completed;
  }
  setSingleCheckE2(completed: boolean) {
    this.fiveComplete = completed;
  }
  setSingleCheckF2(completed: boolean) {
    this.sixComplete = completed;
  }
  setSingleCheckG2(completed: boolean) {
    this.sevenComplete = completed;
  }
  setSingleCheckH2(completed: boolean) {
    this.eightComplete = completed;
  }
  setSingleCheckI2(completed: boolean) {
    this.nineComplete = completed;
  }
  setSingleCheckJ2(completed: boolean) {
    this.tenComplete = completed;
  }
  setSingleCheckK2(completed: boolean) {
    this.elevenComplete = completed;
  }
  setSingleCheckL2(completed: boolean) {
    this.twelveComplete = completed;
  }
  setSingleCheckM2(completed: boolean) {
    this.thirteenComplete = completed;
  }
  setSingleCheckN2(completed: boolean) {
    this.fourteenComplete = completed;
  }
  setSingleCheckO2(completed: boolean) {
    this.fifteenComplete = completed;
  }
}
