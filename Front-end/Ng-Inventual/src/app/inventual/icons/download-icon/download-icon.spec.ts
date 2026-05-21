import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadIcon } from './download-icon';

describe('DownloadIcon', () => {
  let component: DownloadIcon;
  let fixture: ComponentFixture<DownloadIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadIcon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadIcon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
