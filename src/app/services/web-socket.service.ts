import { Injectable, OnDestroy } from '@angular/core';
import { CompatClient, Stomp, StompSubscription } from '@stomp/stompjs';
import { BehaviorSubject, Observable, Subject, take } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { Message } from '../model/message.model';
import { Router } from '@angular/router';
import { StatusMessage } from '../model/status-message.model';
import { LoginService } from './login.service';
import { UserInfo } from '../model/userInfo.model';
import { User } from '../model/user';
@Injectable({
  providedIn: 'root'
})
export class WebSocketService implements OnDestroy{

  public stompClient!: CompatClient;
  public joinStompClient! :  CompatClient;
  public joinSubscription! : StompSubscription;
  private stompSubscription!: StompSubscription;
  webSocketEndPoint: string = 'http://localhost:8087/websocket';
  // private messageSubject = new Subject<any>();
  public username!:string;
  public userid!:string;
  
  topic: string = "/user/"+this.username+"/private";
  public receiverUsername!:string;
  public receiverUserid!:string;
  private receiverSubject : BehaviorSubject<string> =  new BehaviorSubject<string>(this.receiverUsername);
  public receiver$ : Observable<string> = this.receiverSubject.asObservable();
  private chatSubject : BehaviorSubject<Record<string,Array<Message>>> = new BehaviorSubject<Record<string,Array<Message>>>({});
  public chats$ : Observable<Record<string,Array<Message>>> = this.chatSubject.asObservable(); 
  private messageSubject: BehaviorSubject<Array<Message>> = new BehaviorSubject<Array<Message>>([]);
  private user : BehaviorSubject<Array<UserInfo>> = new BehaviorSubject<Array<UserInfo>>([]);
  public userList$ : Observable<Array<UserInfo>> = this.user.asObservable();
  public messageArray$: Observable<Array<Message>> = this.messageSubject.asObservable();
  private messageReceivedSubject: Subject<Message | null> = new Subject<Message | null>();
  public messageReceived$: Observable<Message | null> = this.messageReceivedSubject.asObservable();

  constructor(public router:Router, private loginService:LoginService) { }

  changeReceiver(receiver : UserInfo){
    this.receiverUsername = receiver.name;
    this.receiverUserid = receiver.id;
    this.receiverSubject.next(receiver.name);
  }

  join() : void {
    this.userid=this.loginService.getLoggedUser().id;
    this.username = this.loginService.getLoggedUser().name;
    const socket =  new SockJS(this.webSocketEndPoint);
    this.joinStompClient = Stomp.over(socket);
    const _this = this;
    _this.joinStompClient.connect({},function (frame : any){
      _this.joinStompClient.subscribe("/topic/join",function (event){
        _this.onUserJoin(event);
      });
    const connectMessage = new StatusMessage();
    connectMessage.senderId = _this.loginService.getLoggedUser().id;
    connectMessage.senderName=_this.loginService.getLoggedUser().name;
    _this.joinStompClient.send(
      '/app/chat.join',
      {},
      JSON.stringify(connectMessage)
    );
    });


  }

  connect(): void {
    if(this.stompClient && this.stompClient.active){
      return;
    }
    const socket = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(socket);
    const _this = this;
    _this.stompClient.connect({}, function (frame: any) {
      _this.stompClient.subscribe("/user/"+_this.userid+"/private", function (sdkEvent) {
          _this.onMessageReceived(sdkEvent);
    });

    const systemMessage=new Message();
    systemMessage.senderName=_this.username;
    systemMessage.senderId=_this.userid;
    systemMessage.content=`${_this.username} joined the chat` ;
    systemMessage.type='JOIN';
    systemMessage.isGroupChat=false;
    systemMessage.receiverId=
    systemMessage.receiverName=_this.receiverUsername;
    _this.stompClient.send(
      '/app/chat.register',
      {},
      JSON.stringify(systemMessage)
    );
  }, this.onError);
  }

  private onError(error: any): void {
    console.error('WebSocket Error:', error);
  }

  onUserJoin( payload : any ) : void{
    const message : StatusMessage = JSON.parse(payload.body)
    this.user.next([...message.users]);
    this.chatSubject.next({...this.chatSubject.value,...this.getUserChatHistory(message.history)})
  }

  getUserChatHistory(messages : Record<string,Array<Message>>){
    let chatHistory :  Record<string,Array<Message>> = {};
    for (const key in messages){
      if(messages.hasOwnProperty(key)){
        chatHistory[key + '-' + this.userid] = messages[key];
      }
    }
    return chatHistory;
  }


  send(messageContent: string): void {
    if (messageContent && this.stompClient) {

      const chatMessage=new Message();
      
      chatMessage.senderName=this.username;
      chatMessage.senderId=this.userid;
      chatMessage.content=messageContent;
      chatMessage.receiverId=this.receiverUserid;
      chatMessage.receiverName=this.receiverUsername;
      chatMessage.isGroupChat=false;
      chatMessage.type='CHAT';
      this.stompClient.send('/app/chat.send', {}, JSON.stringify(chatMessage));
      this.messageSubject.next([...this.messageSubject.value, chatMessage]);
      const existingRecord = this.chatSubject.value[chatMessage.receiverId + "-" + chatMessage.senderId] || [];
      const updatedChatRecord = [...existingRecord , chatMessage];
      this.chatSubject.next({...this.chatSubject.value,[chatMessage.receiverId + "-" + chatMessage.senderId] : updatedChatRecord });
    }
  }

  onMessageReceived = (payload: any): void => {
    const message : Message = JSON.parse(payload.body);
    const existingRecord = this.chatSubject.value[message.senderId + "-"+ message.receiverId] || [];
    const updatedChatRecord = [...existingRecord , message];
    this.chatSubject.next({...this.chatSubject.value,[message.senderId + "-" + message.receiverId] : updatedChatRecord });
    this.messageSubject.next([...this.messageSubject.value, message]);
    this.messageReceivedSubject.next(message);
    
  };

  getMessageSubject(): Subject<any> {
    return this.messageSubject;
  }

  disconnect(): void {
    if (this.stompSubscription) {
      this.stompSubscription.unsubscribe();
    }

    if (this.stompClient) {
      this.stompClient.disconnect();
    }
  }
  
  ngOnDestroy(): void {
    this.leaveChat(this.username);
  }

  private onLeave(username: string): void {
    if(this.stompClient && this.stompClient.connected){
      const leaveMessage = new StatusMessage();
      leaveMessage.senderName = username;
      leaveMessage.senderId=this.userid;
      this.stompClient.send(
        '/app/chat.unregister',
        {},
        JSON.stringify(leaveMessage)    
      );
    }
    else{
      console.log("No STOMP connection");
    }
    
  }

  leaveChat(username: string): void {
    if (this.stompClient) {
      const emptyUser: UserInfo = {
        id: "",
        name: "",
        status: ""
      };
      this.onLeave(username);
      this.changeReceiver(emptyUser);
      if(this.stompClient && this.stompClient.active){
        this.stompClient.disconnect();
      }
    }
  }
}