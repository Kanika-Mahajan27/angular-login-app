import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { AvatarService } from 'src/app/services/avatar.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-profile-setup',
  templateUrl: './profile-setup.component.html',
  styleUrls: ['./profile-setup.component.css']
})
export class ProfileSetupComponent {
  profileForm! : FormGroup;
  selectedFile! : File;
  imageSrc! : string;
  user : User = JSON.parse(localStorage.getItem("loggedUser")!);
  constructor(private fb: FormBuilder, private loginService: LoginService, private router:Router , private avatarService : AvatarService){
    this.profileForm = fb.group({
      name : ['',Validators.required],
    })
  }

  getSelectedFile($event: Event) {
    const inputElement = $event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedFile = inputElement.files[0];
    }
  }

  completeProfile(){
    this.user.name = this.profileForm.get('name')?.value;
    if(this.selectedFile){
      this.encodeImageBase64(this.selectedFile).then(base64 => {
        this.user.image = base64;
          this.loginService.updateUser(this.user).subscribe({
            next : (res)=> {
              localStorage.setItem("loggedUser",JSON.stringify(res));
              this.router.navigate(["/home"]);
            },
            error  : (err) => {
              console.error(err);
              
            }
          })
        });
      }else{
        this.avatarService.generateAvatar(this.profileForm.get("name")?.value).subscribe({
          next : (blob : Blob) => {
              this.encodeImageBase64(new File([blob] , "image")).then(base64 => {
                this.user.image  = base64;
                this.loginService.updateUser(this.user).subscribe({
                  next : (res)=> {
                    localStorage.setItem("loggedUser",JSON.stringify(res)); 
                    this.router.navigate(["/home"]);
                  },
                  error  : (err) => {
                    console.error(err);
                  }
                })
              });
          }
        })
      }
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

async getImageFromBase64() {
  try {
    const base64 = await this.encodeImageBase64(this.selectedFile);
    return `data:image/png;base64,${base64}`; 
  } catch (error) {
    console.error('Error encoding image:', error);
    throw error;
  }
}
async loadImage() {
  try {
    const imageUrl = await this.getImageFromBase64();
    this.imageSrc = imageUrl;
  } catch (error) {
    console.error('Error loading image:', error);
  }
}

}
