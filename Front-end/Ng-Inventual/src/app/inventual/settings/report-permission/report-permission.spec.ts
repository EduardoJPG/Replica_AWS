import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPermission } from './report-permission';

describe('ReportPermission', () => {
  let component: ReportPermission;
  let fixture: ComponentFixture<ReportPermission>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportPermission]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportPermission);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
