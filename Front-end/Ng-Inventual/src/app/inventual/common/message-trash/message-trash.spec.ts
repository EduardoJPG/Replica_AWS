import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageTrash } from './message-trash';

describe('MessageTrash', () => {
  let component: MessageTrash;
  let fixture: ComponentFixture<MessageTrash>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageTrash]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageTrash);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
