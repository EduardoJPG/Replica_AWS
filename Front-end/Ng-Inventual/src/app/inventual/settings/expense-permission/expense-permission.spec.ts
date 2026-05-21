import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensePermission } from './expense-permission';

describe('ExpensePermission', () => {
  let component: ExpensePermission;
  let fixture: ComponentFixture<ExpensePermission>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpensePermission]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpensePermission);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
