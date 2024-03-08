import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Post } from 'src/app/model/post.model';
import { User } from 'src/app/model/user';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent {
  postForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,private postService : PostsService,private router : Router) {}
  user : User =  JSON.parse(localStorage.getItem("loggedUser")!);
  ngOnInit() {
    this.postForm = this.formBuilder.group({
      content: ['', [Validators.required, this.noWhitespaceValidator]]
    });
  }
  get content() {
    return this.postForm.get('content');
  }

  submitPost() {
    if (this.postForm.valid) {
        const post  = this.postForm.value;
        this.postService.createPost(post).subscribe({
          next : (res : Post)=>{
            this.router.navigate([`/post-details/${res.id}`]);
          },
          error(err) {
              console.error(err);
          },
        })
        
    } else {
      this.postForm.markAllAsTouched();
    }
  }
  
  noWhitespaceValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value.trim() === '') {
      return { 'required': true };
    }
    return null;
  }
}
