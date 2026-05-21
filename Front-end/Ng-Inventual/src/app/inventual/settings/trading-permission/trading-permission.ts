import { Component } from '@angular/core';
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
  selector: 'app-trading-permission',
  imports: [
    MatCheckboxModule
  ],
  templateUrl: './trading-permission.html',
  styleUrl: './trading-permission.scss',
})
export class TradingPermission {
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
  twentyoneComplete: boolean = false;
  twentytwoComplete: boolean = false;
  twentythreeComplete: boolean = false;
  twentyfourComplete: boolean = false;
  twentyfiveComplete: boolean = false;
  twentysixComplete: boolean = false;
  twentysevenComplete: boolean = false;
  twentyeightComplete: boolean = false;
  twentynineComplete: boolean = false;
  thirtyComplete: boolean = false;
  thirtyoneComplete: boolean = false;
  thirtytwoComplete: boolean = false;
  thirtythreeComplete: boolean = false;
  thirtyfourComplete: boolean = false;
  thirtyfiveComplete: boolean = false;
  thirtysixComplete: boolean = false;
  thirtysevenComplete: boolean = false;
  thirtyeightComplete: boolean = false;
  thirtynineComplete: boolean = false;
  fourtyComplete: boolean = false;

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

  setAllA(completed: boolean) {
    this.isComplete = completed;
    this.allComplete = completed;
    if (this.task.subtasks == null) {
      return;
    }
    this.task.subtasks.forEach((t) => (t.completed = completed));
  }

  setSingleCheckA(completed: boolean) {
    this.oneComplete = completed;
  }
  setSingleCheckB(completed: boolean) {
    this.twoComplete = completed;
  }
  setSingleCheckC(completed: boolean) {
    this.threeComplete = completed;
  }
  setSingleCheckD(completed: boolean) {
    this.fourComplete = completed;
  }
  setSingleCheckE(completed: boolean) {
    this.fiveComplete = completed;
  }
  setSingleCheckF(completed: boolean) {
    this.sixComplete = completed;
  }
  setSingleCheckG(completed: boolean) {
    this.sevenComplete = completed;
  }
  setSingleCheckH(completed: boolean) {
    this.eightComplete = completed;
  }
  setSingleCheckI(completed: boolean) {
    this.nineComplete = completed;
  }
  setSingleCheckJ(completed: boolean) {
    this.tenComplete = completed;
  }
  setSingleCheckK(completed: boolean) {
    this.elevenComplete = completed;
  }
  setSingleCheckL(completed: boolean) {
    this.twelveComplete = completed;
  }
  setSingleCheckM(completed: boolean) {
    this.thirteenComplete = completed;
  }
  setSingleCheckN(completed: boolean) {
    this.fourteenComplete = completed;
  }
  setSingleCheckO(completed: boolean) {
    this.fifteenComplete = completed;
  }
  setSingleCheckP(completed: boolean) {
    this.sixteenComplete = completed;
  }
  setSingleCheckQ(completed: boolean) {
    this.seventeenComplete = completed;
  }
  setSingleCheckR(completed: boolean) {
    this.eighteenComplete = completed;
  }
  setSingleCheckS(completed: boolean) {
    this.nineteenComplete = completed;
  }
  setSingleCheckT(completed: boolean) {
    this.twentyComplete = completed;
  }
  setSingleCheckU(completed: boolean) {
    this.twentyoneComplete = completed;
  }
  setSingleCheckV(completed: boolean) {
    this.twentytwoComplete = completed;
  }
  setSingleCheckW(completed: boolean) {
    this.twentythreeComplete = completed;
  }
  setSingleCheckX(completed: boolean) {
    this.twentyfourComplete = completed;
  }

  setSingleCheckY(completed: boolean) {
    this.twentyfiveComplete = completed;
  }
  setSingleCheckZ(completed: boolean) {
    this.twentysixComplete = completed;
  }
  setSingleCheckAA(completed: boolean) {
    this.twentysevenComplete = completed;
  }
  setSingleCheckAB(completed: boolean) {
    this.twentyeightComplete = completed;
  }
  setSingleCheckAC(completed: boolean) {
    this.twentynineComplete = completed;
  }
  setSingleCheckAD(completed: boolean) {
    this.thirtyComplete = completed;
  }
  setSingleCheckAE(completed: boolean) {
    this.thirtyoneComplete = completed;
  }
  setSingleCheckAF(completed: boolean) {
    this.thirtytwoComplete = completed;
  }
  setSingleCheckAG(completed: boolean) {
    this.thirtythreeComplete = completed;
  }
  setSingleCheckAH(completed: boolean) {
    this.thirtyfourComplete = completed;
  }
  setSingleCheckAI(completed: boolean) {
    this.thirtyfiveComplete = completed;
  }
  setSingleCheckAJ(completed: boolean) {
    this.thirtysixComplete = completed;
  }
  setSingleCheckAK(completed: boolean) {
    this.thirtysevenComplete = completed;
  }
  setSingleCheckAL(completed: boolean) {
    this.thirtyeightComplete = completed;
  }
  setSingleCheckAM(completed: boolean) {
    this.thirtynineComplete = completed;
  }
  setSingleCheckAN(completed: boolean) {
    this.fourtyComplete = completed;
  }
}
