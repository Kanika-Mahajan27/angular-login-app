import { Component, HostListener, Input, OnInit } from '@angular/core';
import { CommentPage } from 'src/app/model/comment-page.model';
import { Comment } from 'src/app/model/comment.model';
import { CommentService } from 'src/app/services/comment.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-comment-feed',
  templateUrl: './comment-feed.component.html',
  styleUrls: ['./comment-feed.component.css']
})
export class CommentFeedComponent implements OnInit{
  @Input()
  postId! : string;
  comments : Array<Comment> =[];
  last : boolean = false;
  total! : number;
  page : number = 1;
  size : number = 5;
  loadingComments : boolean = false;

  constructor(private commentService : CommentService,private loginService : LoginService){}

  ngOnInit(){
    this.loadComments();
  }

  loadComments(){
    this.loadingComments = true;
    this.commentService.getComments(this.postId,this.page,this.size).subscribe({
      next : (res : CommentPage) =>{
        this.comments.push(...res.comments);
        this.total = res.total;
        this.page++;
        this.last=res.last;
      },
      error : (err)=>{
        console.error(err);
      },
      complete :() => {
          this.loadingComments = false;
      },
    })
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
      if (this.last == false && this.loadingComments == false) {
        this.loadComments();
      }
  }

  public refreshComments(){
    this.comments = [];
    this.loadingComments = false;
    this.loadComments();
  }

  addComment(comment : Comment){
    comment.commentAuthor = this.loginService.getLoggedUser();
    this.comments.unshift(comment);
    this.comments = [...this.comments];
  }

  deleteComment(id: string) {
    this.commentService.deleteComment(id).subscribe({
      next : (res) => {
        const updatedComments = this.comments.filter(comment => comment.id != id);
        this.comments = [...updatedComments];
      },
      error : (err) => {
        console.error("Could not delete comment!");
      }
    })
  }


}
