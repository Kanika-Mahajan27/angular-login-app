import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  constructor(private router : Router,private loginService : LoginService,private websocketService : WebSocketService){};
  navigateToLoginPage():void{
    this.router.navigate(['/login'])
  }
  navigateToRegisterPage():void{
    this.router.navigate(['/register'])
  }
  navigateToHome(): void {
    this.router.navigate(['/home']);
  }

  connect(): void {
      const username=this.loginService.loggedUser?.name;
      this.websocketService.username=username!;
      if(!this.websocketService.joinStompClient){
        this.websocketService.join();
      }
      this.router.navigate(['/chatbox'])
  }

  logout(): void {
    this.websocketService.leaveChat(this.websocketService.username);
    this.loginService.logoutUser();
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("authToken");
    this.router.navigate(["/login"]);
  }
}
