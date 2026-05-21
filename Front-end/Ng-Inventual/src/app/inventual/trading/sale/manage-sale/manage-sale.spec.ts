import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSale } from './manage-sale';

describe('ManageSale', () => {
  let component: ManageSale;
  let fixture: ComponentFixture<ManageSale>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageSale]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageSale);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
