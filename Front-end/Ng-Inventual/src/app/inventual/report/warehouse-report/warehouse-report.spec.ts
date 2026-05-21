import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseReport } from './warehouse-report';

describe('WarehouseReport', () => {
  let component: WarehouseReport;
  let fixture: ComponentFixture<WarehouseReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
