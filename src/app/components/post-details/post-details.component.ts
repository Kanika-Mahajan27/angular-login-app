import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/model/post.model';
import { LoginService } from 'src/app/services/login.service';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent implements OnInit {

  post!: Post;

  constructor(private route:ActivatedRoute, private postsService:PostsService, private loginService:LoginService){}
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const postId = params.get('id'); // Get postId from URL
      if (postId) {
        this.fetchPostDetails(postId); // Fetch post details using postId
      }
    });
  }

  fetchPostDetails(postId: string) {
    this.postsService.getPostDetails(postId).subscribe({
      next: (post: Post) => {
        this.post = post;
      },
      error: (err) => {
        console.error(err);
        // Handle error
      }
    });
  }

  formatDate(date : Date) {
    const datePipe = new DatePipe("en-US");
    return datePipe.transform(date,'medium','IST');
  }

  likePost(postId: string) {
    this.postsService.likePost(postId).subscribe({
      next : (res) =>{
        const userLikedIndex = this.post.likes.findIndex(email => email === this.loginService.getLoggedUser()?.email);
       if(userLikedIndex != -1){
        this.post.likes.splice(userLikedIndex, 1)
       }
       else{
        this.post.likes.push(this.loginService.loggedUser?.email!);
       
       }
       this.post.likes = [...this.post.likes];
       this.post={...this.post};
       console.log(this.post.likes);
        
      }, error(err) {
        console.error(err);
      }
            
    });
  }

  isPostLiked(postId: string): boolean {
    return this.post.likes.includes(this.loginService.getLoggedUser().email!);
  }

}
