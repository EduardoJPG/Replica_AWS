import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageDraft } from './message-draft';

describe('MessageDraft', () => {
  let component: MessageDraft;
  let fixture: ComponentFixture<MessageDraft>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageDraft]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageDraft);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
