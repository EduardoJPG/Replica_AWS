import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Quickview } from './quickview';

describe('Quickview', () => {
  let component: Quickview;
  let fixture: ComponentFixture<Quickview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Quickview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Quickview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
