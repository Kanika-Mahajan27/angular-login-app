import { Component, ElementRef, HostListener, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { Notification } from 'src/app/model/notification.model';
import { PostPage } from 'src/app/model/post-page.model';
import { Post } from 'src/app/model/post.model';
import { User } from 'src/app/model/user';
import { LoginService } from 'src/app/services/login.service';
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
  noPosts: boolean = false;
  user! : User;
  @ViewChild('exampleModal') modal!: ElementRef;

  constructor(private postService : PostsService, private loginService : LoginService, private route:ActivatedRoute){}

  ngOnInit(): void {
    this.loadPosts();
    this.route.paramMap.subscribe(params => {
      const userId = params.get('id'); 
      if (userId) {
        this.fetchUserDetails(userId); 
      }
    });
  }

  fetchUserDetails(userId: any) {
    this.loginService.getUserProfile(userId).subscribe({
      next : (res : User) => {
        this.user = res;
      },
      error : (err )=>{
        console.error(err);
        
      }
    })
  }

  loadPosts(){
    this.loadingPost = true;
    this.postService.getPosts(this.page,this.size,this.feed).subscribe({
      next : (res : PostPage) => { 
        if(res.posts.length === 0){
          this.noPosts=true;
        }
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
  
  public refreshFeed(){
    this.posts = [];
    this.loadingPost = false;
    this.loadPosts();
  }

  deletePost(data: string) {
    this.postService.deletePost(data).subscribe({
      next : (res) => {
        const updatedPosts = this.posts.filter(post => post.id !== data);
        this.posts = [...updatedPosts];
      },
      error : (err) => {
        console.error("Could Not Delete Post");
        
      }
    })
  }

  public get currentUser() : User {
    return this.loginService.getLoggedUser();
  }

  dismissModal() {
    const modalTriggerElement = document.querySelector('[data-bs-target="#exampleModal"]');
    if (modalTriggerElement) {
      (modalTriggerElement as HTMLElement).click(); 
    } else {
      console.error('Modal trigger element not found.');
    }
  }

}
