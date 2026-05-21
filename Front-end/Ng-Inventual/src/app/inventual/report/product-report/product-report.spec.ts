import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductReport } from './product-report';

describe('ProductReport', () => {
  let component: ProductReport;
  let fixture: ComponentFixture<ProductReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
