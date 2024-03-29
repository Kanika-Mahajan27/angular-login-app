import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Post } from 'src/app/model/post.model';
import { User } from 'src/app/model/user';
import { PostsService } from 'src/app/services/posts.service';
import { noWhitespaceValidator } from 'src/app/validators/noWhitespaceValidator';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent {
  postForm!: FormGroup;
  @Output() postCreated: EventEmitter<void> = new EventEmitter<void>();
  
  constructor(private formBuilder: FormBuilder,private postService : PostsService,private router : Router) {}
  user : User =  JSON.parse(localStorage.getItem("loggedUser")!);
  ngOnInit() {
    this.postForm = this.formBuilder.group({
      content: ['', [Validators.required, noWhitespaceValidator()]]
    });
  }
  get content() {
    return this.postForm.get('content');
  }

  submitPost(post : string) {
    const postBody : Record<string,string> = {};
    postBody["content"] = post;
    this.postService.createPost(postBody).subscribe({
      next : (res : Post)=>{
        this.postCreated.emit();
        this.router.navigate([`/post-details/${res.id}`]);            
      },
      error(err) {
          console.error(err);
      },
    })
  }
}
