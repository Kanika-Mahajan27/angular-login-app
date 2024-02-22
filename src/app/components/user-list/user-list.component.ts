import { Component, OnInit } from '@angular/core';
import { UserInfo } from 'src/app/model/userInfo.model';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit{
  
  users : Array<UserInfo> = [];

  constructor(private webSocketService : WebSocketService){}

  ngOnInit(): void {
    this.webSocketService.userList$.subscribe((user)=>{
      this.users=[];
      this.users = [...user];
    })
  }

  changeReceiver(receiver : UserInfo){
    this.webSocketService.changeReceiver(receiver);
  }

  isCurrentUser(user:UserInfo){    
    return this.webSocketService.userid === user.id;
  }

  //CHANGE HERE TO ID
  isCurrentReceiver(user : UserInfo){
    return this.webSocketService.receiverUsername === user.name;
  }

  get userStatuses() {
    return Object.entries(this.users).map(([key, value]) => ({ key, value }));
  }

  isUserActive(user : UserInfo){
    return user.status == "Active";
  }
}
