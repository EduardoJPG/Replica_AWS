import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseListInvoice } from './expense-list-invoice';

describe('ExpenseListInvoice', () => {
  let component: ExpenseListInvoice;
  let fixture: ComponentFixture<ExpenseListInvoice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseListInvoice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseListInvoice);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
