import { Component, HostListener } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { OtpService } from 'src/app/services/otp.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  username!:string;
  isSidebarOpen: boolean = false;
  constructor(private websocketService:WebSocketService, public loginService:LoginService, public otpService:OtpService, public router: Router){
    this.username=loginService.loggedUser?.name!;
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
  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event): void {
    this.websocketService.leaveChat(this.websocketService.username);
  }  
}
