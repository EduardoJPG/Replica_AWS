import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingPermission } from './trading-permission';

describe('TradingPermission', () => {
  let component: TradingPermission;
  let fixture: ComponentFixture<TradingPermission>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradingPermission]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradingPermission);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
