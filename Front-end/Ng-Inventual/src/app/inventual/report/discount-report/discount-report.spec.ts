import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountReport } from './discount-report';

describe('DiscountReport', () => {
  let component: DiscountReport;
  let fixture: ComponentFixture<DiscountReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscountReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscountReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
