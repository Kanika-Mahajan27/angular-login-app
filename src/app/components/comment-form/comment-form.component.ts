import { Component, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Post } from 'src/app/model/post.model';
import { CommentService } from 'src/app/services/comment.service';
import { LoginService } from 'src/app/services/login.service';
import { CommentFeedComponent } from '../comment-feed/comment-feed.component';
import { Comment } from 'src/app/model/comment.model';
import { PostDetails } from 'src/app/model/post-details.model';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css']
})
export class CommentFormComponent {
commentForm!: FormGroup;
@Input()
postDetails! : PostDetails;
post! : Post;

@ViewChild(CommentFeedComponent) commentFeedComponent! : CommentFeedComponent;

constructor(private fb : FormBuilder,private commentService : CommentService,private loginService : LoginService){}

  ngOnInit() {
    this.post = this.postDetails.post;
    this.commentForm= this.fb.group({
      content: ['', Validators.required]
    });
  }

  get content(){
    return this.commentForm.get("content")?.value;
  }


submitComment() {
  if(this.commentForm.valid){
    let commentBody : Record<string,string> = {};
    commentBody["postId"] = this.post.id;
    commentBody["postAuthorId"] = this.post.author.id;
    commentBody["content"] = this.commentForm.get("content")?.value;
    this.commentService.addComment(commentBody).subscribe({
      next : (res : Comment) => {
        this.commentForm.reset();
        this.commentFeedComponent.addComment(res);
      },
      error : (err) => {
        console.error(err);
        
      }
    })
  }else{
    this.commentForm.markAllAsTouched();
  }
}

get authorImage(){
  return this.loginService.getLoggedUser().image;
}

}
