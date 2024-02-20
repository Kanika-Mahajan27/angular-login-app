import { Component, OnInit } from '@angular/core';
import { Notification } from 'src/app/model/notification.model';
import { NotificationService } from 'src/app/services/notification.service';


@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  showToastMessage: boolean = false;
  recentNotification!: Notification ;

  constructor(private notificationService: NotificationService){}

  ngOnInit(): void {
    this.notificationService.notificationReceived$.subscribe((message) => {
      if (message) {
        console.log("message", message);      
        this.recentNotification=message;
        this.showToastMessage = true;
        console.log(this.recentNotification);
        
      }
    });
  }

  onToastHidden() {
    this.showToastMessage = false;
  }

}
