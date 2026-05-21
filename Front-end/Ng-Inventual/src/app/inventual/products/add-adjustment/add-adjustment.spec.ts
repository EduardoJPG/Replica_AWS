import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAdjustment } from './add-adjustment';

describe('AddAdjustment', () => {
  let component: AddAdjustment;
  let fixture: ComponentFixture<AddAdjustment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAdjustment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAdjustment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
