import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { User } from 'src/app/model/user';
import { LoginService } from 'src/app/services/login.service';
import { PostsService } from 'src/app/services/posts.service';
import { FeedComponent } from '../feed/feed.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AvatarService } from 'src/app/services/avatar.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { UserInfo } from 'src/app/model/userInfo.model';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit{

  user! : User;

  editingProfile : boolean = false;
  profileForm: FormGroup<any>;
  selectedFile! : File;
  constructor(private route:ActivatedRoute, private loginService:LoginService,private fb : FormBuilder,private avatarService : AvatarService,private webSocketService : WebSocketService,private router: Router){
    this.profileForm = fb.group({
      name : [''],
    })
  }
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


  
  public get currentUser() : User {
    return this.loginService.getLoggedUser();
  }

  getSelectedFile($event: Event) {
    const inputElement = $event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedFile = inputElement.files[0];
    }
  }

  chatWith(){
    const reciever =  new UserInfo();
    reciever.id = this.user.id;
    reciever.name = this.user.name
    this.webSocketService.join();
    this.webSocketService.changeReceiver(reciever);
    this.router.navigate(['/chatbox']);
  }

  completeProfile(){
    let updatedProfile =  {...this.user}
    if(this.profileForm.get("name")?.value){
      updatedProfile.name = this.profileForm.get('name')?.value;
    }
    if(this.selectedFile){
      this.encodeImageBase64(this.selectedFile).then(base64 => {
        updatedProfile.image = base64;
          this.loginService.updateUser(updatedProfile).subscribe({
            next : (res)=> {
              localStorage.setItem("loggedUser",JSON.stringify(res));
              this.user = {...res};
            },
            error  : (err) => {
              console.error(err);
              
            }
          })
        });
      }else{
        this.avatarService.generateAvatar(updatedProfile.name).subscribe({
          next : (blob : Blob) => {
              this.encodeImageBase64(new File([blob] , "image")).then(base64 => {
                updatedProfile.image = base64;
                this.loginService.updateUser(updatedProfile).subscribe({
                  next : (res)=> {
                    localStorage.setItem("loggedUser",JSON.stringify(res)); 
                    this.user = {...res};

                  },
                  error  : (err) => {
                    console.error(err);
                  }
                })
              });
          }
        })
      }
    window.alert("Profile Updated Sucessfully!");
    this.editingProfile =  !this.editingProfile;
    this.feedComponent.refreshFeed();
  }

  encodeImageBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (reader.result) {
        resolve(reader.result.toString().split(',')[1]);
      } else {
        reject(new Error('Failed to read image file.'));
      }
    };
    reader.onerror = error => reject(error);
  });

}
}

  
