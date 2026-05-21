import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeoplePermission } from './people-permission';

describe('PeoplePermission', () => {
  let component: PeoplePermission;
  let fixture: ComponentFixture<PeoplePermission>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeoplePermission]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeoplePermission);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
