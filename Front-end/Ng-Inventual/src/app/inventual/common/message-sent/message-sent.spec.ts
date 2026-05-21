import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageSent } from './message-sent';

describe('MessageSent', () => {
  let component: MessageSent;
  let fixture: ComponentFixture<MessageSent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageSent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageSent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
