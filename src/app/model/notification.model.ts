import { DatePipe } from "@angular/common";

export class Notification {
  sender!: string;
  receiver!: string;
  content!: string;
  postId!: string;
  timestamp!: string|null;
  constructor(){
    const datePipe =  new DatePipe('en-US');
    this.timestamp = datePipe.transform(new Date(),'short','IST');
  }
}
