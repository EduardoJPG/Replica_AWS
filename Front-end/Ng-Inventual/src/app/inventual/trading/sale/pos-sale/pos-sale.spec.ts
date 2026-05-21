import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosSale } from './pos-sale';

describe('PosSale', () => {
  let component: PosSale;
  let fixture: ComponentFixture<PosSale>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosSale]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosSale);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
