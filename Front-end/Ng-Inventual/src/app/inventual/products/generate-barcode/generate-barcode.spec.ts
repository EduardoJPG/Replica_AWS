import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateBarcode } from './generate-barcode';

describe('GenerateBarcode', () => {
  let component: GenerateBarcode;
  let fixture: ComponentFixture<GenerateBarcode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateBarcode]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateBarcode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
