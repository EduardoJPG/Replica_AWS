import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingReport } from './shipping-report';

describe('ShippingReport', () => {
  let component: ShippingReport;
  let fixture: ComponentFixture<ShippingReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShippingReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
