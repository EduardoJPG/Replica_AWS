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
  selector: 'app-people-permission',
  imports: [MatCheckboxModule],
  templateUrl: './people-permission.html',
  styleUrl: './people-permission.scss',
  encapsulation: ViewEncapsulation.None,
})
export class PeoplePermission {
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
  seventeenComplete: boolean = false;
  eighteenComplete: boolean = false;
  nineteenComplete: boolean = false;
  twentyComplete: boolean = false;

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

  setAllAB(completed: boolean) {
    this.isComplete = completed;
    this.allComplete = completed;
    if (this.task.subtasks == null) {
      return;
    }
    this.task.subtasks.forEach((t) => (t.completed = completed));
  }

  setSingleCheckA1(completed: boolean) {
    this.oneComplete = completed;
  }
  setSingleCheckB1(completed: boolean) {
    this.twoComplete = completed;
  }
  setSingleCheckC1(completed: boolean) {
    this.threeComplete = completed;
  }
  setSingleCheckD1(completed: boolean) {
    this.fourComplete = completed;
  }
  setSingleCheckE1(completed: boolean) {
    this.fiveComplete = completed;
  }
  setSingleCheckF1(completed: boolean) {
    this.sixComplete = completed;
  }
  setSingleCheckG1(completed: boolean) {
    this.sevenComplete = completed;
  }
  setSingleCheckH1(completed: boolean) {
    this.eightComplete = completed;
  }
  setSingleCheckI1(completed: boolean) {
    this.nineComplete = completed;
  }
  setSingleCheckJ1(completed: boolean) {
    this.tenComplete = completed;
  }
  setSingleCheckK1(completed: boolean) {
    this.elevenComplete = completed;
  }
  setSingleCheckL1(completed: boolean) {
    this.twelveComplete = completed;
  }
  setSingleCheckM1(completed: boolean) {
    this.thirteenComplete = completed;
  }
  setSingleCheckN1(completed: boolean) {
    this.fourteenComplete = completed;
  }
  setSingleCheckO1(completed: boolean) {
    this.fifteenComplete = completed;
  }
  setSingleCheckP1(completed: boolean) {
    this.sixteenComplete = completed;
  }
  setSingleCheckQ1(completed: boolean) {
    this.seventeenComplete = completed;
  }
  setSingleCheckR1(completed: boolean) {
    this.eighteenComplete = completed;
  }
  setSingleCheckS1(completed: boolean) {
    this.nineteenComplete = completed;
  }
  setSingleCheckT1(completed: boolean) {
    this.twentyComplete = completed;
  }
}
