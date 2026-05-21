import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTransfer } from './add-transfer';

describe('AddTransfer', () => {
  let component: AddTransfer;
  let fixture: ComponentFixture<AddTransfer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTransfer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTransfer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
