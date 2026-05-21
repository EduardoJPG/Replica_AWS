import { Component, ViewEncapsulation } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ThemePalette } from '@angular/material/core';

//for checkbox
export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}

@Component({
  selector: 'app-system-permission',
  imports: [MatCheckboxModule],
  templateUrl: './system-permission.html',
  styleUrl: './system-permission.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SystemPermission {
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

  setSingleCheckA3(completed: boolean) {
    this.oneComplete = completed;
  }
  setSingleCheckB3(completed: boolean) {
    this.twoComplete = completed;
  }
  setSingleCheckC3(completed: boolean) {
    this.threeComplete = completed;
  }
  setSingleCheckD3(completed: boolean) {
    this.fourComplete = completed;
  }
  setSingleCheckE3(completed: boolean) {
    this.fiveComplete = completed;
  }
  setSingleCheckF3(completed: boolean) {
    this.sixComplete = completed;
  }
  setSingleCheckG3(completed: boolean) {
    this.sevenComplete = completed;
  }
  setSingleCheckH3(completed: boolean) {
    this.eightComplete = completed;
  }
  setSingleCheckI3(completed: boolean) {
    this.nineComplete = completed;
  }
  setSingleCheckJ3(completed: boolean) {
    this.tenComplete = completed;
  }
  setSingleCheckK3(completed: boolean) {
    this.elevenComplete = completed;
  }
  setSingleCheckL3(completed: boolean) {
    this.twelveComplete = completed;
  }
  setSingleCheckM3(completed: boolean) {
    this.thirteenComplete = completed;
  }
  setSingleCheckN3(completed: boolean) {
    this.fourteenComplete = completed;
  }
  setSingleCheckO3(completed: boolean) {
    this.fifteenComplete = completed;
  }
}
