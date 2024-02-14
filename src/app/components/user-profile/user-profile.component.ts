import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/model/user';
import { LoginService } from 'src/app/services/login.service';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  user! : User;

  constructor(private route:ActivatedRoute, private postsService:PostsService, private loginService:LoginService){}
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const userId = params.get('id'); // Get postId from URL
      if (userId) {
        this.fetchUserDetails(userId); // Fetch post details using postId
      }
    });
  }
  fetchUserDetails(userId: any) {
    this.loginService.getUserProfile(userId).subscribe({
      next : (res : User) => {
        this.user = res;
      }
    })
  }

}
