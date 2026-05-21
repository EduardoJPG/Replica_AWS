import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDiscountTwo } from './order-discount-two';

describe('OrderDiscountTwo', () => {
  let component: OrderDiscountTwo;
  let fixture: ComponentFixture<OrderDiscountTwo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderDiscountTwo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderDiscountTwo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
