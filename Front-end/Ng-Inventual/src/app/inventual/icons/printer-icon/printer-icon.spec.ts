import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrinterIcon } from './printer-icon';

describe('PrinterIcon', () => {
  let component: PrinterIcon;
  let fixture: ComponentFixture<PrinterIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrinterIcon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrinterIcon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
