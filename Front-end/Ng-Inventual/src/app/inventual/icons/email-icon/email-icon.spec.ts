import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailIcon } from './email-icon';

describe('EmailIcon', () => {
  let component: EmailIcon;
  let fixture: ComponentFixture<EmailIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailIcon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailIcon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
