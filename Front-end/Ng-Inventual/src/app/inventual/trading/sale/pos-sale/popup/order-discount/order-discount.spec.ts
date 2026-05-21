import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDiscount } from './order-discount';

describe('OrderDiscount', () => {
  let component: OrderDiscount;
  let fixture: ComponentFixture<OrderDiscount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderDiscount]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderDiscount);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
