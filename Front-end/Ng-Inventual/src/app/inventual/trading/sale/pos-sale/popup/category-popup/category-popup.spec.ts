import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryPopup } from './category-popup';

describe('CategoryPopup', () => {
  let component: CategoryPopup;
  let fixture: ComponentFixture<CategoryPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
