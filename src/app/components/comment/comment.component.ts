import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Comment } from 'src/app/model/comment.model';
import { CommentService } from 'src/app/services/comment.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent {

  @Input()
  comment! : Comment;

  @Output() deleteCommentEvent = new EventEmitter<string>();


  constructor(private loginService : LoginService){}

  get commentDate(){
    const datePipe =  new DatePipe('en-US');        
    return  datePipe.transform(this.comment.createdAt,'short','IST');
  }

  get loggedUser(){
    return this.loginService.getLoggedUser();
  }

  deleteComment() {
    this.deleteCommentEvent.emit(this.comment.id);
  }
}
