import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleReturns } from './sale-returns';

describe('SaleReturns', () => {
  let component: SaleReturns;
  let fixture: ComponentFixture<SaleReturns>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleReturns]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleReturns);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
