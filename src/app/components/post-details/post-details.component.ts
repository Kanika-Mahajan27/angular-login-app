import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, catchError, forkJoin, of } from 'rxjs';
import { PostDetails } from 'src/app/model/post-details.model';
import { Post } from 'src/app/model/post.model';
import { User } from 'src/app/model/user';
import { CommentService } from 'src/app/services/comment.service';
import { LoginService } from 'src/app/services/login.service';
import { PostsService } from 'src/app/services/posts.service';


@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent implements OnInit {

  post!: Post;
  postDetails! : PostDetails;
  commentCount: number = 0;
  likedByUser : User[] = [];


  constructor(private route:ActivatedRoute, private postsService:PostsService, private loginService:LoginService,private commentService : CommentService){}
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
      next: (post: PostDetails) => {
        this.post = post.post;
        this.postDetails = post
        this.getcommentCount();
        this.fetchLikedByUsers().subscribe({
          next : (res : User[]) => {
            this.likedByUser = [...res];
          },
          error : (err) =>{
            console.warn(err);
          }
        })
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
        const userLikedIndex = this.post.likes.findIndex(id => id === this.loginService.getLoggedUser()?.id);
       if(userLikedIndex != -1){
        this.post.likes.splice(userLikedIndex, 1)
        this.removeUserFromLikes(this.loginService.getLoggedUser().id);

       }
       else{
        this.post.likes.push(this.loginService.loggedUser?.id!);
        this.addUserToLiked(this.loginService.getLoggedUser().id)
       }
       this.post.likes = [...this.post.likes];
       this.post={...this.post};   
      }, error(err) {
        console.error(err);
      }
            
    });
  }

  isPostLiked(): boolean {
    return this.post.likes.includes(this.loginService.getLoggedUser().id) || this.post.likes.includes(this.loginService.getLoggedUser().email) ;
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
        defaultUser.name = "A User";
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
