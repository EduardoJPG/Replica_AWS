import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrowIcon } from './arrow-icon';

describe('ArrowIcon', () => {
  let component: ArrowIcon;
  let fixture: ComponentFixture<ArrowIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArrowIcon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArrowIcon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
