import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferList } from './transfer-list';

describe('TransferList', () => {
  let component: TransferList;
  let fixture: ComponentFixture<TransferList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
