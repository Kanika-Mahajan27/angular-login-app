import { DatePipe } from "@angular/common";

export class Message {
    public  content!:string ;
    public  sender!:string; //username
    public  receiver!:string; // reciever_username
    public  group:string = ""; // empty
    public  isGroupChat!:boolean; //false
    public  type!:string; 
    timestamp : string | null;
    constructor(){
        const datePipe =  new DatePipe('en-US');
        this.timestamp = datePipe.transform(new Date(),'short','IST');
    }
}
