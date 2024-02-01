import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { MessageComponent } from '../message/message.component';
import { Message } from '../../model/message.model';

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
  
  constructor(private router:Router, public webSocketService:WebSocketService, private formBuilder:FormBuilder){
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
    this.webSocketService.connect(this.webSocketService.username);
    this.webSocketService.messageReceived$.subscribe((message) => {
      if (message) {
        // Show Bootstrap toast here
        this.showToastMessage=true;
        this.recentMessage = message;
      }
    });
  }
  showBootstrapToast(message: Message):void {
    
  }

  send(messageContent: string): void {
    
    if (messageContent && this.webSocketService.stompClient) {
      
      console.log("array length:",this.messageArrayLength);
      this.webSocketService.send(messageContent);
      this.messageSent=true;
      this.messageForm.get('message')?.setValue('');
    }
  }  

  // sendPrivate(): void{


  //   if(this.receiverForm.valid){
  //     this.webSocketService.receiverUsername=this.receiverForm.value.receiver;
  //     this.webSocketService.connect(this.webSocketService.username);
  //     this.showChatBox=true;
  //     // this.webSocketService.sendPrivate(receiver);
      
  //   }
  // }


}
