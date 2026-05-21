import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPermission } from './product-permission';

describe('ProductPermission', () => {
  let component: ProductPermission;
  let fixture: ComponentFixture<ProductPermission>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductPermission]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductPermission);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
