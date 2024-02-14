import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { AvatarService } from 'src/app/services/avatar.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  selectedFile! : File;
  userForm: FormGroup;
  errorMessage!: string;
  alreadyExists:boolean=false;

  constructor(private fb: FormBuilder, private loginService: LoginService, private router:Router , private avatarService : AvatarService) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  registerUser() {
    // if (this.userForm.valid) {
      const formData : Record<string , any> = {};
      formData['email'] =  this.userForm.get('email')?.value
      formData['password'] = this.userForm.get('password')?.value
      this.loginService.addUser(formData).subscribe(
        (response) => {
          console.log('response: ', response);
          if(response ){
            this.router.navigate(['/login']);
          }
        },
        (error) => {
          console.log("error: ", error);
          if(error.status===409){
            this.alreadyExists=true;
            console.error('User with this email already exists');
          }
          if (error.status === 400) {
            // this.alreadyExists=true;
            console.error('Invalid request');
            this.errorMessage = "Validation Failed!";
            console.log("errorMessage: ", this.errorMessage);
          } else {
            console.error('Failed to add user:', error);
            this.errorMessage = 'Failed to register. Please try again later.';
          }
        }
      );
  }
//       if(this.selectedFile){
//         this.encodeImageBase64(this.selectedFile).then(base64 => {
//           formData['image']  = base64;
//           this.loginService.registerUser(formData).subscribe({
//             next : (res)=> {
//               console.log(res); 
//             }
//           })
//         });
//       }else{
//         this.avatarService.generateAvatar(this.userForm.get("name")?.value).subscribe({
//           next : (blob : Blob) => {
//               this.encodeImageBase64(new File([blob] , "image")).then(base64 => {
//                 formData['image']  = base64;
//                 this.loginService.registerUser(formData).subscribe({
//                   next : (res)=> {
//                     console.log(res); 
//                   }
//                 })
//               });
//           }
//         })
//       }
//   }
//   getSelectedFile($event: Event) {
//     const inputElement = $event.target as HTMLInputElement;
//     if (inputElement.files && inputElement.files.length > 0) {
//       this.selectedFile = inputElement.files[0];
//     }
//   }

// encodeImageBase64(file: File): Promise<string> {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => {
//       if (reader.result) {
//         resolve(reader.result.toString().split(',')[1]);
//       } else {
//         reject(new Error('Failed to read image file.'));
//       }
//     };
//     reader.onerror = error => reject(error);
//   });
// }
}
