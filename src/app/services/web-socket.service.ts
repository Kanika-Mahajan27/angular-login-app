import { Injectable, OnDestroy } from '@angular/core';
import { CompatClient, Stomp, StompSubscription } from '@stomp/stompjs';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { Message } from '../model/message.model';
import { Router } from '@angular/router';
import { StatusMessage } from '../model/status-message.model';
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
  
  topic: string = "/user/"+this.username+"/private";
  public receiverUsername!:string;
  private receiverSubject : BehaviorSubject<string> =  new BehaviorSubject<string>(this.receiverUsername);
  public receiver$ : Observable<string> = this.receiverSubject.asObservable();
  private chatSubject : BehaviorSubject<Record<string,Array<Message>>> = new BehaviorSubject<Record<string,Array<Message>>>({});
  public chats$ : Observable<Record<string,Array<Message>>> = this.chatSubject.asObservable(); 
  private messageSubject: BehaviorSubject<Array<Message>> = new BehaviorSubject<Array<Message>>([]);
  private user : BehaviorSubject<Record<string,string>> = new BehaviorSubject<Record<string,string>>({});
  public userList$ : Observable<Record<string,string>> = this.user.asObservable();
  // Public observable property for components to subscribe to
  public messageArray$: Observable<Array<Message>> = this.messageSubject.asObservable();

  private messageReceivedSubject: Subject<Message | null> = new Subject<Message | null>();

  // Public observable property for components to subscribe to
  public messageReceived$: Observable<Message | null> = this.messageReceivedSubject.asObservable();

  constructor(public router:Router) { }

  changeReceiver(receiver : string){
    this.receiverUsername = receiver;
    this.receiverSubject.next(receiver);
  }

  join(username : string) : void {
    const socket =  new SockJS(this.webSocketEndPoint);
    this.joinStompClient = Stomp.over(socket);
    const _this = this;
    _this.joinStompClient.connect({},function (frame : any){
      _this.joinStompClient.subscribe("/topic/join",function (event){
        _this.onUserJoin(event);
      });
    const connectMessage = new StatusMessage();
    connectMessage.sender = username;
    _this.joinStompClient.send(
      '/app/chat.join',
      {},
      JSON.stringify(connectMessage)
    );
    });


  }

  connect(username: string): void {
    if(this.stompClient && this.stompClient.active){
      return;
    }
    const socket = new SockJS(this.webSocketEndPoint);
    // let socket=io(this.webSocketEndPoint);
    this.stompClient = Stomp.over(socket);
    const _this = this;
    _this.stompClient.connect({}, function (frame: any) {
      _this.stompClient.subscribe("/user/"+_this.username+"/private", function (sdkEvent) {
          _this.onMessageReceived(sdkEvent);
    });


      // Add a system message when a user joins
      
      const systemMessage=new Message();
      systemMessage.sender=_this.username;
      systemMessage.content=`${username} joined the chat` ;
      systemMessage.type='JOIN';
      // systemMessage.group=""
      systemMessage.isGroupChat=false;
      systemMessage.receiver=_this.receiverUsername;
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

  private onConnected(username: string): void {
    this.stompSubscription = this.stompClient.subscribe("/user/"+this.username+"/private", this.onMessageReceived);

    this.stompClient.send(
      '/app/chat.register',
      {},
      JSON.stringify({ sender: username, type: 'JOIN' })
    );
  }
  private onError(error: any): void {
    console.error('WebSocket Error:', error);
    // Handle the error
  }

  onUserJoin( payload : any ) : void{
    const message : StatusMessage = JSON.parse(payload.body)
      this.user.next({...message.users});
      this.chatSubject.next({...this.chatSubject.value,...this.getUserChatHistory(message.history)})
  }

  getUserChatHistory(messages : Array<Message>){
    let chatHistory :  Record<string,Array<Message>> = {};
    messages.forEach((message) => {
    let key: string;
    
    if (this.username === message.sender) {
      key = message.receiver + "-" + message.sender;
    } else {
      key = message.sender + "-" + message.receiver;
    }

    // Ensure the chat record exists
    const existingRecord = chatHistory[key] || [];

    // Append the message to the chat record
    const updatedChatRecord = [...existingRecord, message];

    // Update the chatHistory object with the new chat record
    chatHistory = {
      ...chatHistory,
      [key]: updatedChatRecord,
    };
  });

  return chatHistory;
  }

  send(messageContent: string): void {
    if (messageContent && this.stompClient) {

      const chatMessage=new Message();
      
      chatMessage.sender=this.username;
      chatMessage.content=messageContent;
      chatMessage.receiver=this.receiverUsername;
      chatMessage.isGroupChat=false;
      chatMessage.type='CHAT';

      console.log("chatMessage: ", chatMessage);
      this.stompClient.send('/app/chat.send', {}, JSON.stringify(chatMessage));
      this.messageSubject.next([...this.messageSubject.value, chatMessage]);
      const existingRecord = this.chatSubject.value[chatMessage.receiver + "-" + chatMessage.sender] || [];
    const updatedChatRecord = [...existingRecord , chatMessage];
    this.chatSubject.next({...this.chatSubject.value,[chatMessage.receiver + "-" + chatMessage.sender] : updatedChatRecord });
    }
  }


  onMessageReceived = (payload: any): void => {
    const message = JSON.parse(payload.body);
    // if(message.type === "JOIN"){
    //   this.user.next([...this.user.value,message.sender]);
    // }
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
    leaveMessage.sender = username;


    this.stompClient.send(
      '/app/chat.unregister',
      {},
      JSON.stringify(leaveMessage)    
    );

    // this.messageSubject.next([...this.messageSubject.value, systemMessage]);
  }

  leaveChat(username: string): void {
    // if (this.stompSubscription) {
    //   this.stompSubscription.unsubscribe();
    // }

    if (this.stompClient) {
      this.onLeave(username);
      this.stompClient.disconnect();
    }
  }


}
