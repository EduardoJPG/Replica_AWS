import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleReturnsPopup } from './sale-returns-popup';

describe('SaleReturnsPopup', () => {
  let component: SaleReturnsPopup;
  let fixture: ComponentFixture<SaleReturnsPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleReturnsPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleReturnsPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
