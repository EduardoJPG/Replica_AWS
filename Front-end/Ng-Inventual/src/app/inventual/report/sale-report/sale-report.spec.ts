import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleReport } from './sale-report';

describe('SaleReport', () => {
  let component: SaleReport;
  let fixture: ComponentFixture<SaleReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
