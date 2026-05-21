import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Adjustment } from './adjustment';

describe('Adjustment', () => {
  let component: Adjustment;
  let fixture: ComponentFixture<Adjustment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Adjustment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Adjustment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
