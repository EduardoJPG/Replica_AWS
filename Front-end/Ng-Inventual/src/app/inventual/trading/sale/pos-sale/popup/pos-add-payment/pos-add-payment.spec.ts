import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosAddPayment } from './pos-add-payment';

describe('PosAddPayment', () => {
  let component: PosAddPayment;
  let fixture: ComponentFixture<PosAddPayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosAddPayment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosAddPayment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
