import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentExpense } from './payment-expense';

describe('PaymentExpense', () => {
  let component: PaymentExpense;
  let fixture: ComponentFixture<PaymentExpense>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentExpense]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentExpense);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
