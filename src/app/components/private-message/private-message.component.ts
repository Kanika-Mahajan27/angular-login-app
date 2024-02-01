import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-private-message',
  templateUrl: './private-message.component.html',
  styleUrls: ['./private-message.component.css']
})
export class PrivateMessageComponent implements OnInit {

  messageSent:boolean=false;
  messageForm!: FormGroup;
  messageArrayLength: number = 0;
  
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    // Subscribe to the messageArray$ observable
    this.webSocketService.messageArray$.subscribe(messages => {
      // Update the length property when the array changes
      this.messageArrayLength = messages.length;
    });
    console.log("array length:",this.messageArrayLength);
  }

  constructor(private formBuilder:FormBuilder, private webSocketService:WebSocketService){
    this.messageForm = this.formBuilder.group({
      message: ['', Validators.required]
    });
  }

  send(messageContent: string): void {
    
    if (messageContent && this.webSocketService.stompClient) {
      
      console.log("array length:",this.messageArrayLength);
      this.webSocketService.send(messageContent);
      this.messageSent=true;
      this.messageForm.get('message')?.setValue('');
    }
  }  

}
