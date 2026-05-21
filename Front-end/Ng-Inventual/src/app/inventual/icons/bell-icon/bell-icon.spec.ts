import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BellIcon } from './bell-icon';

describe('BellIcon', () => {
  let component: BellIcon;
  let fixture: ComponentFixture<BellIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BellIcon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BellIcon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
