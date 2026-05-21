import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandPopup } from './brand-popup';

describe('BrandPopup', () => {
  let component: BrandPopup;
  let fixture: ComponentFixture<BrandPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
