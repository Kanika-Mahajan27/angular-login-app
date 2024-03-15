import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CompatClient, IMessage, Stomp, StompSubscription } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Notification } from '../model/notification.model';
import {  Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

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
  public notificationReceived$: Observable<Notification | null> = this.notificationReceivedSubject.asObservable();

  constructor(public router:Router) { }

  webSocketEndPoint: string = environment.notificationServiceUrl;

  connect(): void {
    if(this.stompClient && this.stompClient.active){
      return;
    }
    const socket = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(socket);
    const _this = this;
    _this.stompClient.connect({}, function (frame: any) {
      _this.stompClient.subscribe("/user/"+JSON.parse(localStorage.getItem("loggedUser")!)?.id+"/private", function (sdkEvent) {
          _this.onMessageReceived(sdkEvent);
    });
    }, this.onError);
  }

  onMessageReceived = (payload: any): void => {
    const message = JSON.parse(payload.body);
    this.notificationReceivedSubject.next(message);
  };
  private onError(error: any): void {
    console.error('WebSocket Error:', error);
  }

}
