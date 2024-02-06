import { Component, HostListener, OnInit } from '@angular/core';
import { PostPage } from 'src/app/model/post-page.model';
import { Post } from 'src/app/model/post.model';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit{
  posts : Array<Post> = [];
  page : number = 1;
  size : number = 7;
  total : number = 0
  
  constructor(private postService : PostsService){}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(){
    this.postService.getPosts(this.page,this.size).subscribe({
      next : (res : PostPage) => { 
        this.posts.push(...res.posts);
        this.total = res.total;
        this.page++;
      },
      error(err) {
          console.error(err);
      },
    })
  }
  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      if (!this.last) {
        this.loadPosts();
      }
    }
  }

  get last(): boolean {
    return this.posts.length >= this.total;
  }



}
