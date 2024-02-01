import { Component, NgModule, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { Message } from '../../model/message.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})

export class MessageComponent implements OnDestroy {

  private chatSubscription!: Subscription;
  public messageArray: Array<Message> = [];
  private chats!:  Record<string,Array<Message>>;

  constructor(private webSocketService: WebSocketService , private datePipe :  DatePipe) {
    this.chatSubscription = this.webSocketService.chats$.subscribe((chats: Record<string,Array<Message>>)  => {
      this.chats =  chats;
      this.messageArray = chats[this.webSocketService.receiverUsername + "-" + this.webSocketService.username];
      console.log("From message component",this.messageArray);
    });
    this.webSocketService.receiver$.subscribe(receiver => {
      this.messageArray = this.chats[receiver + "-" + this.webSocketService.username];
    })
  }

  checkSender(message:Message):boolean{
    return this.webSocketService.username===message.sender;
  }

  ngOnDestroy(): void {
    this.chatSubscription.unsubscribe();
  }
}
