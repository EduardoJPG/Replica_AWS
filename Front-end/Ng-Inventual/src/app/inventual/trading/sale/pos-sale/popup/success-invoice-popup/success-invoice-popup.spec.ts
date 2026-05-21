import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessInvoicePopup } from './success-invoice-popup';

describe('SuccessInvoicePopup', () => {
  let component: SuccessInvoicePopup;
  let fixture: ComponentFixture<SuccessInvoicePopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessInvoicePopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccessInvoicePopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
