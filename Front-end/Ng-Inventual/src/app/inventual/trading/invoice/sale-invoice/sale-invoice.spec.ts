import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleInvoice } from './sale-invoice';

describe('SaleInvoice', () => {
  let component: SaleInvoice;
  let fixture: ComponentFixture<SaleInvoice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleInvoice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleInvoice);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
