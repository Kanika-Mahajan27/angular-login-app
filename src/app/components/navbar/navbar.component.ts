import { Component, HostListener } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { OtpService } from 'src/app/services/otp.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  username!:string;
  constructor(private websocketService:WebSocketService, public loginService:LoginService, public otpService:OtpService, private router: Router){
    this.username=loginService.loggedUser?.name!;
  }
  connect(): void {
    
      const username=this.loginService.loggedUser?.name;
      const userid=this.loginService.loggedUser?.id;
      this.websocketService.username=username!;
      this.websocketService.join();
      this.router.navigate(['/chatbox'])
    
  }
  navigateToLoginPage():void{
    this.router.navigate(['/login'])
  }
  navigateToRegisterPage():void{
    this.router.navigate(['/register'])
  }
  navigateToHome(): void {
    this.router.navigate(['/home']);
  }
  logout(): void {
    this.leave();
    this.loginService.logoutUser();
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("authToken");
  }

    @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event): void {
    this.websocketService.leaveChat(this.websocketService.username);
  }

  leave(){
    this.websocketService.leaveChat(this.websocketService.username);    
  }
}
