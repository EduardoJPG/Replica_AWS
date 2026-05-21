import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseReturnsPopup } from './purchase-returns-popup';

describe('PurchaseReturnsPopup', () => {
  let component: PurchaseReturnsPopup;
  let fixture: ComponentFixture<PurchaseReturnsPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseReturnsPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseReturnsPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
