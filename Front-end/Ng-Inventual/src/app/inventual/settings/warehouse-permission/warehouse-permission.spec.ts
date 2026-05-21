import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehousePermission } from './warehouse-permission';

describe('WarehousePermission', () => {
  let component: WarehousePermission;
  let fixture: ComponentFixture<WarehousePermission>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehousePermission]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehousePermission);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
