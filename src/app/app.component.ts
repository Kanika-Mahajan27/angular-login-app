import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NotificationService } from './services/notification.service';
import { WebSocketService } from './services/web-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'loginapp';
  showBackComponent: boolean = false;
  showSidebar: boolean = false;
  showToastMessage: boolean = false;
  recentNotification: Notification | null = null;
  constructor(private router: Router, private notificationService: NotificationService, private webSocketService: WebSocketService) { }

  ngOnInit() {
    this.router.events.subscribe(event => {

      if (event instanceof NavigationEnd) {
        const currentRoute = event.url.split('?')[0]; // Exclude query parameters
        // Check if the current route is not one of the excluded routes and it's not the login route
        this.showBackComponent = !['/home', '/login', '/register', '/'].includes(currentRoute) && (currentRoute !== '/login');
        this.showSidebar = !['/login', '/register', '/'].includes(currentRoute) && (currentRoute !== '/login');
      }
    });

    this.notificationService.connect();
    
  }
}
