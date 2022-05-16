import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageService } from '../../services/message/message.service';

import { MessageComponent } from './message.component';

describe('MessageComponent', () => {
  let component: MessageComponent;
  let fixture: ComponentFixture<MessageComponent>;
  let mesSer: MessageService;
  let hostElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MessageComponent],
      providers: [MessageService],
    }).compileComponents();
  });

  beforeEach(() => {
    mesSer = TestBed.inject(MessageService);
    fixture = TestBed.createComponent(MessageComponent);
    hostElement = fixture.nativeElement;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should show the message', () => {
    let exampleMessage = 'This is an example message content';
    let anotherMessage = 'This is another message';
    let contentContainerElement = hostElement.querySelector(
      '.message-content-container'
    );
    // Check first message
    mesSer.createSucessMessage(exampleMessage);
    fixture.detectChanges();
    expect(contentContainerElement.textContent).toBe(exampleMessage);
    // Check second message
    mesSer.createSucessMessage(anotherMessage);
    fixture.detectChanges();
    expect(contentContainerElement.textContent).toBe(anotherMessage);
  });
});
