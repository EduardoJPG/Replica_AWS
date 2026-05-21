import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseInvoice } from './expense-invoice';

describe('ExpenseInvoice', () => {
  let component: ExpenseInvoice;
  let fixture: ComponentFixture<ExpenseInvoice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseInvoice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseInvoice);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
