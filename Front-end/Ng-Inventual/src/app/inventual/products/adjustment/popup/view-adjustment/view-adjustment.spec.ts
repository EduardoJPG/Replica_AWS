import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAdjustment } from './view-adjustment';

describe('ViewAdjustment', () => {
  let component: ViewAdjustment;
  let fixture: ComponentFixture<ViewAdjustment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAdjustment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAdjustment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
