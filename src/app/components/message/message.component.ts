import { AfterViewInit, Component, ElementRef, EventEmitter, NgModule, OnChanges, OnDestroy, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { Message } from '../../model/message.model';
import { DatePipe, ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})

export class MessageComponent implements OnDestroy{

  private chatSubscription!: Subscription;
  public messageArray: Array<Message> = [];
  private chats!:  Record<string,Array<Message>>;
  @Output() newMessage = new EventEmitter<void>();
  @ViewChild("messageArea") messageArea!: ElementRef;


  constructor(private webSocketService: WebSocketService) {
    this.chatSubscription = this.webSocketService.chats$.subscribe((chats: Record<string,Array<Message>>)  => {
      this.chats =  chats;
      this.messageArray = chats[this.webSocketService.receiverUserid + "-" + this.webSocketService.userid];
      this.newMessage.emit();
    });
    this.webSocketService.receiver$.subscribe(receiver => {
      this.messageArray = this.chats[this.webSocketService.receiverUserid + "-" + this.webSocketService.userid];
      this.messageArray = [...this.messageArray]

    })
  }

  scrollToBottom(){
    try {
      this.messageArea.nativeElement.scrollTop = this.messageArea.nativeElement.scrollHeight;
    } catch (error) {
      console.warn(error)
    }
  } 

  ngAfterViewChecked() : void{
    this.scrollToBottom();
  }

  checkSender(message:Message):boolean{
    return this.webSocketService.userid===message.senderId;
  }

  ngOnDestroy(): void {
    this.chatSubscription.unsubscribe();
  }
}
