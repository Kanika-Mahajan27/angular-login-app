import { Component, Input, OnInit } from '@angular/core';
import { PostPage } from 'src/app/model/post-page.model';
import { Post } from 'src/app/model/post.model';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-carousel-feed',
  templateUrl: './carousel-feed.component.html',
  styleUrls: ['./carousel-feed.component.css']
})
export class CarouselFeedComponent implements OnInit{
  @Input()
  author! : string;
  posts : Array<Post> = [];

  constructor(private postService : PostsService){}

  ngOnInit(): void {
    this.postService.getPostsOfAuthor(1,5,this.author).subscribe({
      next : (res : PostPage)=>{
        this.posts = [...res.posts];
      },
      error : (err ) => {
        console.error(err);
        
      }
    })
  }
}
