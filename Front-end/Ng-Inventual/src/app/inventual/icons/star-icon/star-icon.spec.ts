import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarIcon } from './star-icon';

describe('StarIcon', () => {
  let component: StarIcon;
  let fixture: ComponentFixture<StarIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StarIcon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StarIcon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
