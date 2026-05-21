import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWarehouse } from './add-warehouse';

describe('AddWarehouse', () => {
  let component: AddWarehouse;
  let fixture: ComponentFixture<AddWarehouse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddWarehouse]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWarehouse);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
