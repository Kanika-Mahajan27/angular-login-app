import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { MessageComponent } from '../message/message.component';
import { Message } from '../../model/message.model';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements OnInit {

  messageArrayLength: number = 0;
  messageSent:boolean=false;
  username: string;
  messageForm: FormGroup;
  receiverForm!: FormGroup;
  showChatBox:boolean=false;
  showToastMessage:boolean=false;
  recentMessage!:Message;
  
  constructor( public webSocketService:WebSocketService, private formBuilder:FormBuilder, private notificationService: NotificationService){
    this.username=webSocketService.username;
    this.messageForm = this.formBuilder.group({
      message: ['', Validators.required]
    });
    this.receiverForm=this.formBuilder.group({
      receiver: ['', Validators.required]
    })
  }

  receiverPresent():boolean{
    return this.webSocketService.receiverUsername!=undefined;
  }

  ngOnInit(): void {
    this.notificationService.connect();
    this.webSocketService.connect();
    this.webSocketService.messageReceived$.subscribe((message) => {
      if (message) {
          this.recentMessage = message;
      }
    });
  }

  send(messageContent: string): void {
    
    if (messageContent && this.webSocketService.stompClient) {

      this.webSocketService.send(messageContent);
      this.messageSent=true;
      this.messageForm.get('message')?.setValue('');
    }
  }  

}
