import { Injectable, OnDestroy } from '@angular/core';
import { CompatClient, Stomp, StompSubscription } from '@stomp/stompjs';
import { BehaviorSubject, Observable, Subject, take } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { Message } from '../model/message.model';
import { Router } from '@angular/router';
import { StatusMessage } from '../model/status-message.model';
import { LoginService } from './login.service';
import { User } from '../model/user';
import { HttpHeaders } from '@angular/common/http';
import { UserInfo } from '../model/userInfo.model';
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
  // Public observable property for components to subscribe to
  public messageArray$: Observable<Array<Message>> = this.messageSubject.asObservable();

  private messageReceivedSubject: Subject<Message | null> = new Subject<Message | null>();

  // Public observable property for components to subscribe to
  public messageReceived$: Observable<Message | null> = this.messageReceivedSubject.asObservable();

  constructor(public router:Router, private loginService:LoginService) { }

  changeReceiver(receiver : UserInfo){
    this.receiverUsername = receiver.name;
    this.receiverUserid = receiver.id;
    this.receiverSubject.next(receiver.name);
  }

  join(username : string, userid : string) : void {
    const socket =  new SockJS(this.webSocketEndPoint);
    this.joinStompClient = Stomp.over(socket);
    const _this = this;
    _this.joinStompClient.connect({'Authorization': `Bearer ${localStorage.getItem("authToken")}`},function (frame : any){
      _this.joinStompClient.subscribe("/topic/join",function (event){
        _this.onUserJoin(event);
      });
    const connectMessage = new StatusMessage();
    connectMessage.senderId = _this.loginService.getLoggedUser().id;
    connectMessage.senderName=_this.loginService.getLoggedUser().name;
    const headers = new HttpHeaders().set("Authorization", `Bearer ${localStorage.getItem("authToken")}`);
    console.log(headers);
    _this.joinStompClient.send(
      '/app/chat.join',
      {'Authorization': `Bearer ${localStorage.getItem("authToken")}`},
      JSON.stringify(connectMessage)
    );
    });


  }

  connect(): void {
    this.userid=this.loginService.getLoggedUser().id;
    this.username = this.loginService.getLoggedUser().name;
    console.log(this.userid, this.username);
    if(this.stompClient && this.stompClient.active){
      return;
    }
    const socket = new SockJS(this.webSocketEndPoint);
    // let socket=io(this.webSocketEndPoint);
    this.stompClient = Stomp.over(socket);
    const _this = this;
    console.log(_this.userid);
    _this.stompClient.connect({}, function (frame: any) {
      _this.stompClient.subscribe("/user/"+_this.userid+"/private", function (sdkEvent) {
          _this.onMessageReceived(sdkEvent);
    });


      // Add a system message when a user joins
      
      const systemMessage=new Message();
      systemMessage.senderName=_this.username;
      systemMessage.senderId=_this.userid;
      systemMessage.content=`${_this.username} joined the chat` ;
      systemMessage.type='JOIN';
      // systemMessage.group=""
      systemMessage.isGroupChat=false;
      systemMessage.receiverId=
      systemMessage.receiverName=_this.receiverUsername;
      // _this.messageSubject.next([..._this.messageSubject.value, systemMessage]);
      _this.stompClient.send(
        '/app/chat.register',
        {},
        JSON.stringify(systemMessage)
      );
      //_this.stompClient.reconnect_delay = 2000;
  }, this.onError);

    // this.stompClient.connect({}, () => this.onConnected(username), this.onError);
  }

  private onError(error: any): void {
    console.error('WebSocket Error:', error);
    // Handle the error
  }

  onUserJoin( payload : any ) : void{
    const message : StatusMessage = JSON.parse(payload.body)
    const users: Record<string, Array<string>> = {};
    
    // Update the existing user data with the new user information

      this.user.next([...message.users]);

      // this.user.next(users);
      console.log(this.user);
      console.log(message.history);
      this.chatSubject.next({...this.chatSubject.value,...this.getUserChatHistory(message.history)})
  }

  getUserChatHistory(messages : Record<string,Array<Message>>){
  let chatHistory :  Record<string,Array<Message>> = {};
  for (const key in messages){
    if(messages.hasOwnProperty(key)){
      chatHistory[key + '-' + this.username] = messages[key];
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

      console.log("chatMessage: ", chatMessage);
      this.stompClient.send('/app/chat.send', {}, JSON.stringify(chatMessage));
      this.messageSubject.next([...this.messageSubject.value, chatMessage]);
      const existingRecord = this.chatSubject.value[chatMessage.receiverName + "-" + chatMessage.senderName] || [];
    const updatedChatRecord = [...existingRecord , chatMessage];
    this.chatSubject.next({...this.chatSubject.value,[chatMessage.receiverName + "-" + chatMessage.senderName] : updatedChatRecord });
    }
  }


  onMessageReceived = (payload: any): void => {
    const message = JSON.parse(payload.body);
    // if(message.type === "JOIN"){
    //   this.user.next([...this.user.value,message.sender]);
    // }
    console.log(message);
    const existingRecord = this.chatSubject.value[message.sender + "-"+ message.receiver] || [];
    const updatedChatRecord = [...existingRecord , message];
    this.chatSubject.next({...this.chatSubject.value,[message.sender + "-" + message.receiver] : updatedChatRecord });
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
    const leaveMessage = new StatusMessage();
    leaveMessage.senderName = username;
    leaveMessage.senderId=this.userid;

    this.stompClient.send(
      '/app/chat.unregister',
      {},
      JSON.stringify(leaveMessage)    
    );

    // this.messageSubject.next([...this.messageSubject.value, systemMessage]);
  }

  leaveChat(username: string): void {

    if (this.stompClient) {
      this.onLeave(username);
      this.stompClient.disconnect();
    }
  }


}
