import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { LoginService } from 'src/app/services/login.service';
@Component({
  selector: 'app-chatbox-container',
  templateUrl: './chatbox-container.component.html',
  styleUrls: ['./chatbox-container.component.css']
})
export class ChatboxContainerComponent {

    constructor(public webSocketService : WebSocketService, private router: Router, public loginService:LoginService){}

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event): void {
    this.webSocketService.leaveChat(this.webSocketService.username);
  }

  leave(){
    this.webSocketService.leaveChat(this.webSocketService.username);
    this.router.navigate(["/"]);
    
  }
}
