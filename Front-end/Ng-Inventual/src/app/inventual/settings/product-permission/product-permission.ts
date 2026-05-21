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
  selector: 'app-product-permission',
  imports: [MatCheckboxModule],
  templateUrl: './product-permission.html',
  styleUrl: './product-permission.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ProductPermission {
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
  twentyoneComplete: boolean = false;
  twentytwoComplete: boolean = false;
  twentythreeComplete: boolean = false;
  twentyfourComplete: boolean = false;

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

  setAll(completed: boolean) {
    this.isComplete = completed;
    this.allComplete = completed;
    if (this.task.subtasks == null) {
      return;
    }
    this.task.subtasks.forEach((t) => (t.completed = completed));
  }

  setSingleCheck1(completed: boolean) {
    this.oneComplete = completed;
  }
  setSingleCheck2(completed: boolean) {
    this.twoComplete = completed;
  }
  setSingleCheck3(completed: boolean) {
    this.threeComplete = completed;
  }
  setSingleCheck4(completed: boolean) {
    this.fourComplete = completed;
  }
  setSingleCheck5(completed: boolean) {
    this.fiveComplete = completed;
  }
  setSingleCheck6(completed: boolean) {
    this.sixComplete = completed;
  }

  setSingleCheck7(completed: boolean) {
    this.sevenComplete = completed;
  }
  setSingleCheck8(completed: boolean) {
    this.eightComplete = completed;
  }
  setSingleCheck9(completed: boolean) {
    this.nineComplete = completed;
  }
  setSingleCheck10(completed: boolean) {
    this.tenComplete = completed;
  }
  setSingleCheck11(completed: boolean) {
    this.elevenComplete = completed;
  }
  setSingleCheck12(completed: boolean) {
    this.twelveComplete = completed;
  }
  setSingleCheck13(completed: boolean) {
    this.thirteenComplete = completed;
  }
  setSingleCheck14(completed: boolean) {
    this.fourteenComplete = completed;
  }
  setSingleCheck15(completed: boolean) {
    this.fifteenComplete = completed;
  }

  setSingleCheck16(completed: boolean) {
    this.sixteenComplete = completed;
  }
  setSingleCheck17(completed: boolean) {
    this.seventeenComplete = completed;
  }
  setSingleCheck18(completed: boolean) {
    this.eighteenComplete = completed;
  }
  setSingleCheck19(completed: boolean) {
    this.nineteenComplete = completed;
  }
  setSingleCheck20(completed: boolean) {
    this.twentyComplete = completed;
  }
  setSingleCheck21(completed: boolean) {
    this.twentyoneComplete = completed;
  }
  setSingleCheck22(completed: boolean) {
    this.twentytwoComplete = completed;
  }
  setSingleCheck23(completed: boolean) {
    this.twentythreeComplete = completed;
  }
  setSingleCheck24(completed: boolean) {
    this.twentyfourComplete = completed;
  }
  //checkbox end
}
