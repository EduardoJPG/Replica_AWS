import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobeIcon } from './globe-icon';

describe('GlobeIcon', () => {
  let component: GlobeIcon;
  let fixture: ComponentFixture<GlobeIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobeIcon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobeIcon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
