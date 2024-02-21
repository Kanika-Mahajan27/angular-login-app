import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Notification } from 'src/app/model/notification.model';
import { PostPage } from 'src/app/model/post-page.model';
import { Post } from 'src/app/model/post.model';
import { NotificationService } from 'src/app/services/notification.service';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit{
  @Input()
  feed : string = "all"
  posts : Array<Post> = [];
  page : number = 1;
  size : number = 7;
  last : boolean = false;
  total : number = 0
  post! : Post;
  loadingPost : boolean =  false;
  showToastMessage: boolean = false;
  recentNotification: Notification | null = null;

  constructor(private notificationService: NotificationService, private postService : PostsService, private router : Router, private cdr: ChangeDetectorRef){}

  ngOnInit(): void {
    this.loadPosts();
    this.notificationService.notificationReceived$.subscribe((message) => {
      if (message) {
        this.showToastMessage = true;
        this.recentNotification = message;
      }
    });
  }

  loadPosts(){
    this.loadingPost = true;
    this.postService.getPosts(this.page,this.size,this.feed).subscribe({
      next : (res : PostPage) => { 
        this.posts.push(...res.posts);
        this.total = res.total;
        this.page++;
        this.last = res.last;
      },
      error(err) {
          console.error(err);
      },
      complete : ()=>{
        this.loadingPost = false;
      }
    })
  }
  @HostListener('window:scroll', ['$event'])
  onScroll() {
      if (this.last == false && this.loadingPost == false) {
        this.loadPosts();
      }
  }


  onShowToastMessageChange(showToastMessage: boolean) {
    this.showToastMessage = showToastMessage;
    // Handle showToastMessage change here
  }
  
  public refreshFeed(){
    this.posts = [];
    this.loadingPost = false;
    this.loadPosts();
  }
}
