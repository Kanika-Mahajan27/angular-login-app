import { Component, OnInit } from '@angular/core';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit{
  
  users : Record<string,string> = {};

  constructor(private webSocketService : WebSocketService){}

  ngOnInit(): void {
    this.webSocketService.userList$.subscribe((user)=>{
      this.users = {...user};
    })
  }

  changeReceiver(receiver : string){
    this.webSocketService.changeReceiver(receiver);
  }

  isCurrentUser(user:string){
    return this.webSocketService.username === user;
  }

  isCurrentReceiver(user : string){
    return this.webSocketService.receiverUsername === user;
  }

  get userStatuses() {
    return Object.entries(this.users).map(([key, value]) => ({ key, value }));
  }

  isUserActive(user : string){
    return this.users[user] == "Active";
  }
}
