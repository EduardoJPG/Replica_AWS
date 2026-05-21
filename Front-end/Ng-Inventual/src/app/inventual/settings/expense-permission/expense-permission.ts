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
  selector: 'app-expense-permission',
  imports: [MatCheckboxModule],
  templateUrl: './expense-permission.html',
  styleUrl: './expense-permission.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ExpensePermission {
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
  sixteenComplete: boolean = false;

  disabled_condition = true;

  updateAllComplete() {
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

  setAllAA(completed: boolean) {
    this.isComplete = completed;
    this.allComplete = completed;
    if (this.task.subtasks == null) {
      return;
    }
    this.task.subtasks.forEach((t) => (t.completed = completed));
  }

  setSingleCheck25(completed: boolean) {
    this.oneComplete = completed;
  }
  setSingleCheck26(completed: boolean) {
    this.twoComplete = completed;
  }
  setSingleCheck27(completed: boolean) {
    this.threeComplete = completed;
  }
  setSingleCheck28(completed: boolean) {
    this.fourComplete = completed;
  }
  setSingleCheck29(completed: boolean) {
    this.fiveComplete = completed;
  }
  setSingleCheck30(completed: boolean) {
    this.sixComplete = completed;
  }
  setSingleCheck31(completed: boolean) {
    this.sevenComplete = completed;
  }
  setSingleCheck32(completed: boolean) {
    this.eightComplete = completed;
  }
  setSingleCheck33(completed: boolean) {
    this.nineComplete = completed;
  }
  setSingleCheck34(completed: boolean) {
    this.tenComplete = completed;
  }
  setSingleCheck35(completed: boolean) {
    this.elevenComplete = completed;
  }
  setSingleCheck36(completed: boolean) {
    this.twelveComplete = completed;
  }
  setSingleCheck37(completed: boolean) {
    this.thirteenComplete = completed;
  }
  setSingleCheck38(completed: boolean) {
    this.fourteenComplete = completed;
  }
  setSingleCheck39(completed: boolean) {
    this.fifteenComplete = completed;
  }
  setSingleCheck40(completed: boolean) {
    this.sixteenComplete = completed;
  }
}
