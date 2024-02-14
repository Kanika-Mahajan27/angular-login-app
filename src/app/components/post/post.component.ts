import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Post } from 'src/app/model/post.model';
import { LoginService } from 'src/app/services/login.service';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent  {

  constructor(private route: ActivatedRoute, public postsService: PostsService, private loginService : LoginService, private router:Router) { }

  @Input()
  post! : Post;

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

  // Method to navigate to post details page
  goToPostDetails(postId: string) {
    this.router.navigate(['/post-details', postId]);
  }

  isPostLiked(postId: string): boolean {
    return this.post.likes.includes(this.loginService.getLoggedUser().email!);
  }

  getImageFromBase64(base64String: string) {
    return `data:image/png;base64,${base64String}`; 
  }

}
