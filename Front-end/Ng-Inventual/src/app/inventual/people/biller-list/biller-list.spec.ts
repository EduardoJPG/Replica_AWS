import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillerList } from './biller-list';

describe('BillerList', () => {
  let component: BillerList;
  let fixture: ComponentFixture<BillerList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillerList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillerList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
