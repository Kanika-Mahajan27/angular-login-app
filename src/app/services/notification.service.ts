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

  private notificationSubject : BehaviorSubject<Record<string,Array<Notification>>> = new BehaviorSubject<Record<string,Array<Notification>>>({});
  public notification$ : Observable<Record<string,Array<Notification>>> = this.notificationSubject.asObservable(); 

  private notificationReceivedSubject: Subject<Notification | null> = new Subject<Notification | null>();
  // Public observable property for components to subscribe to
  public notificationReceived$: Observable<Notification | null> = this.notificationReceivedSubject.asObservable();

  private receiverSubject : BehaviorSubject<string> =  new BehaviorSubject<string>(this.receiverUsername);
  public receiver$ : Observable<string> = this.receiverSubject.asObservable();

  constructor(public router:Router, private postService: PostsService, private loginService:LoginService) { }

  webSocketEndPoint: string = 'http://localhost:8084/websocket';

  connect(username: string): void {
    if(this.stompClient && this.stompClient.active){
      return;
    }
    const socket = new SockJS(this.webSocketEndPoint);
    // let socket=io(this.webSocketEndPoint);
    this.stompClient = Stomp.over(socket);
    const _this = this;
    _this.stompClient.connect({}, function (frame: any) {
      _this.stompClient.subscribe("/user/"+_this.loginService.loggedUser?.email+"/private", function (sdkEvent) {
          _this.onMessageReceived(sdkEvent);
    });

      //_this.stompClient.reconnect_delay = 2000;
    }, this.onError);
  }

  changeReceiver(receiver : string){
    this.receiverUsername = receiver;
    this.receiverSubject.next(receiver);
  }
  onMessageReceived = (payload: any): void => {
    const message = JSON.parse(payload.body);
    
    const existingRecord = this.notificationSubject.value[message.sender + "-"+ message.receiver] || [];
    const updatedChatRecord = [...existingRecord , message];
    this.notificationSubject.next({...this.notificationSubject.value,[message.sender + "-" + message.receiver] : updatedChatRecord });
    this.notificationReceivedSubject.next(message);
  };
  private onError(error: any): void {
    console.error('WebSocket Error:', error);
    // Handle the error
  }

  send(messageContent: string, post:Post): void {
    if (messageContent && this.stompClient) {

      const notification=new Notification();
 
      notification.sender=this.loginService.loggedUser?.name!;
      // notification.receiver="Kanika Mahajan";
      console.log(notification.receiver);
      notification.content=messageContent;
      notification.receiver=post.author;


      console.log("notification: ", notification);
      this.stompClient.send('/app/notification.send', {}, JSON.stringify(notification));
      const existingRecord = this.notificationSubject.value[notification.receiver + "-" + notification.sender] || [];
      const updatedChatRecord = [...existingRecord , notification];
      this.notificationSubject.next({...this.notificationSubject.value,[notification.receiver + "-" + notification.sender] : updatedChatRecord });
    }
  }
}
