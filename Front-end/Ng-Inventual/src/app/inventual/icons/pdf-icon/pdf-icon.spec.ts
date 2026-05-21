import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfIcon } from './pdf-icon';

describe('PdfIcon', () => {
  let component: PdfIcon;
  let fixture: ComponentFixture<PdfIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfIcon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdfIcon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
