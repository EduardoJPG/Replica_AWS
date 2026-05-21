import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseListInvoice } from './purchase-list-invoice';

describe('PurchaseListInvoice', () => {
  let component: PurchaseListInvoice;
  let fixture: ComponentFixture<PurchaseListInvoice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseListInvoice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseListInvoice);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
