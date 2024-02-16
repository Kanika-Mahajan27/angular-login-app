import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/model/user';
import { LoginService } from 'src/app/services/login.service';
import { PostsService } from 'src/app/services/posts.service';
import { FeedComponent } from '../feed/feed.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit{

  user! : User;

  constructor(private route:ActivatedRoute, private postsService:PostsService, private loginService:LoginService){}
  @ViewChild(FeedComponent) feedComponent!: FeedComponent;
  ngOnInit(): void {
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
}
