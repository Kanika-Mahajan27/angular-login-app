import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Notification } from 'src/app/model/notification.model';
import { Post } from 'src/app/model/post.model';
import { User } from 'src/app/model/user';
import { CommentService } from 'src/app/services/comment.service';
import { LoginService } from 'src/app/services/login.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PostsService } from 'src/app/services/posts.service';
import { Observable, catchError, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit  {
  @Output() showToastMessageChange = new EventEmitter<boolean>();
  showToastMessage:boolean=false;
  @Output() recentNotificationChange = new EventEmitter<Notification>();
  recentNotification :Notification={
    sender: '',
    receiver: '',
    content: '',
    postId: '',
    timestamp: null
  };
  messageSent:boolean=false;
  constructor(public postsService: PostsService, private loginService : LoginService, private router:Router, private notificationService: NotificationService,private commentService : CommentService) {
    
   }

  @Input()
  post! : Post;
  commentCount : number = 0;
  likedByUser : User[] = [];

  @Output() deletePostEvent = new EventEmitter<string>();

  ngOnInit(): void {
    this.notificationService.connect();
    this.notificationService.notificationReceived$.subscribe((message) => {
      if (message) {
        // Show Bootstrap toast here
        this.showToastMessage=true;
        this.recentNotification = message;
        this.showToastMessageChange.emit(true); // Emit event here
        this.recentNotificationChange.emit(this.recentNotification); 
      }
    });
    this.getcommentCount();
    this.fetchLikedByUsers().subscribe({
      next : (res : User[]) => {
        this.likedByUser = [...res];
      },
      error : (err) =>{
        console.warn(err);
      }
    })
  }
  showBootstrapToast(message: Notification):void {
    
  }

  formatDate(date : Date) {
    const datePipe = new DatePipe("en-US");
    return datePipe.transform(date,'medium','IST');
  }

  likePost(postId: string) {
    this.postsService.likePost(postId).subscribe({
      next : (res) =>{
        const userLikedIndex = this.post.likes.findIndex(id => id === JSON.parse(localStorage.getItem("loggedUser")!)?.id);
       if(userLikedIndex != -1){
        this.post.likes.splice(userLikedIndex, 1)
        this.removeUserFromLikes(this.loginService.getLoggedUser().id);
       }
       else{
        this.post.likes.push(this.loginService.getLoggedUser().id);
        this.addUserToLiked(this.loginService.getLoggedUser().id)
       
       }
       this.post.likes = [...this.post.likes];
       this.post={...this.post};        
      }, error(err) {
        console.error(err);
      }
            
    });
    
  }

  // Method to navigate to post details page
  goToPostDetails(postId: string) {
    this.router.navigate(['/post-details', postId]);
  }

  isPostLiked(): boolean {
    return this.post.likes.includes(this.loginService.getLoggedUser().id) || this.post.likes.includes(this.loginService.getLoggedUser().email) ;
  }

  getImageFromBase64(base64String: string) {
    return `data:image/png;base64,${base64String}`; 
  }

  
  public get loggedUser() : User {
    return this.loginService.getLoggedUser();
  }

  deletePost(){
    this.deletePostEvent.emit(this.post.id);
  }
  
  getcommentCount(){
    this.commentService.getCommentCount(this.post.id).subscribe({
      next : (res : number)=>{
        this.commentCount = res;
      },
      error : (err)=>{
        console.error(err);
        
      }
    });
  }

  fetchLikedByUsers(): Observable<User[]> {
    const requests = this.post.likes.map((id) => this.loginService.getUserProfile(id).pipe(
      catchError((error)=>{
        console.warn("Could not fetch user id : "+id);
        const defaultUser = new User();
        defaultUser.name = "Unknown User";
        defaultUser.id = "";
        return of(defaultUser);
      })
    ));
    return forkJoin(requests);
  }

  addUserToLiked(id : string){
    this.loginService.getUserProfile(id).subscribe({
      next : (res : User)=>{
        this.likedByUser.push(res);
        this.likedByUser = [...this.likedByUser];
      }
    })
  }

  removeUserFromLikes(id : string){
    this.likedByUser = [...this.likedByUser.filter((user)=> user.id !== id)];
  }
}
