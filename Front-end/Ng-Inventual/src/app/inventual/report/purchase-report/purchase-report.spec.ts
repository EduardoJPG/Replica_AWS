import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseReport } from './purchase-report';

describe('PurchaseReport', () => {
  let component: PurchaseReport;
  let fixture: ComponentFixture<PurchaseReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
