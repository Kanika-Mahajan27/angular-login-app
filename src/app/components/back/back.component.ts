import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { UserInfo } from 'src/app/model/userInfo.model';
@Component({
  selector: 'app-back',
  templateUrl: './back.component.html',
  styleUrls: ['./back.component.css']
})
export class BackComponent {
  showBackComponent: boolean = true;

  constructor(private router: Router,private location : Location, private websocketService: WebSocketService) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showBackComponent = !['/home', '/login', '/register'].includes(event.url);
      }
    });
  }
  goBack(){
    const emptyUser: UserInfo = {
      id: "",
      name: "",
      status: ""
    };
    this.websocketService.changeReceiver(emptyUser);
    this.location.back();
  }


}
