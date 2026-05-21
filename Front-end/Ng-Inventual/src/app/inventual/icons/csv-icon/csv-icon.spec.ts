import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvIcon } from './csv-icon';

describe('CsvIcon', () => {
  let component: CsvIcon;
  let fixture: ComponentFixture<CsvIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CsvIcon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CsvIcon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
