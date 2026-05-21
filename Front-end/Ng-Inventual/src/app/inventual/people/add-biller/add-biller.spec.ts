import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBiller } from './add-biller';

describe('AddBiller', () => {
  let component: AddBiller;
  let fixture: ComponentFixture<AddBiller>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBiller]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBiller);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
