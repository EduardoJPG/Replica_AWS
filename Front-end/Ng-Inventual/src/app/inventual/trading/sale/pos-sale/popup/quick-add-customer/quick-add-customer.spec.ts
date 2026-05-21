import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickAddCustomer } from './quick-add-customer';

describe('QuickAddCustomer', () => {
  let component: QuickAddCustomer;
  let fixture: ComponentFixture<QuickAddCustomer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickAddCustomer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickAddCustomer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
