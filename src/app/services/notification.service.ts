import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CompatClient, IMessage, Stomp, StompSubscription } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { StatusMessage } from '../model/status-message.model';
import { Notification } from '../model/notification.model';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { PostsService } from './posts.service';
import { Post } from '../model/post.model';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  public stompClient!: CompatClient;
  public joinStompClient! :  CompatClient;
  public joinSubscription! : StompSubscription;
  public username!:string;
  public receiverUsername!:string;
  post!:any;

  private notificationReceivedSubject: Subject<Notification | null> = new Subject<Notification | null>();
  // Public observable property for components to subscribe to
  public notificationReceived$: Observable<Notification | null> = this.notificationReceivedSubject.asObservable();

  constructor(public router:Router, private loginService:LoginService) { }

  webSocketEndPoint: string = 'http://localhost:8084/websocket';

  connect(): void {
    if(this.stompClient && this.stompClient.active){
      return;
    }
    const socket = new SockJS(this.webSocketEndPoint);
    // let socket=io(this.webSocketEndPoint);
    this.stompClient = Stomp.over(socket);
    const _this = this;
    _this.stompClient.connect({}, function (frame: any) {
      _this.stompClient.subscribe("/user/"+JSON.parse(localStorage.getItem("loggedUser")!)?.id+"/private", function (sdkEvent) {
          _this.onMessageReceived(sdkEvent);
    });

      //_this.stompClient.reconnect_delay = 2000;
    }, this.onError);
  }

  onMessageReceived = (payload: any): void => {
    const message = JSON.parse(payload.body);
    
    // const existingRecord = this.notificationSubject.value || [];
    // const updatedNotificationRecord = [...existingRecord , message];
    // this.notificationSubject.next([...this.notificationSubject.value, message]);
    this.notificationReceivedSubject.next(message);
  };
  private onError(error: any): void {
    console.error('WebSocket Error:', error);
    // Handle the error
  }

}
