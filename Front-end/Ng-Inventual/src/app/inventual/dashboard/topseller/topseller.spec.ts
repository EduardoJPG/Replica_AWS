import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Topseller } from './topseller';

describe('Topseller', () => {
  let component: Topseller;
  let fixture: ComponentFixture<Topseller>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Topseller]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Topseller);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
