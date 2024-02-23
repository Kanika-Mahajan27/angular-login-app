import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Notification } from 'src/app/model/notification.model';
import { Post } from 'src/app/model/post.model';
import { User } from 'src/app/model/user';
import { LoginService } from 'src/app/services/login.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PostsService } from 'src/app/services/posts.service';

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
  constructor(public postsService: PostsService, private loginService : LoginService, private router:Router, private notificationService: NotificationService) {
    
   }

  @Input()
  post! : Post;

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
       }
       else{
        this.post.likes.push(JSON.parse(localStorage.getItem("loggedUser")!)?.id);
       
       }
       this.post.likes = [...this.post.likes];
       this.post={...this.post};
       console.log(this.post.likes);

        
      }, error(err) {
        console.error(err);
      }
            
    });
    
  }

  // Method to navigate to post details page
  goToPostDetails(postId: string) {
    this.router.navigate(['/post-details', postId]);
  }

  isPostLiked(postId: string): boolean {
    return this.post.likes.includes(this.loginService.getLoggedUser().id!);
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
  

}
