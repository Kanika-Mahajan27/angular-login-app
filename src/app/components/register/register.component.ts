import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  userForm: FormGroup;
  errorMessage!: string;
  alreadyExists:boolean=false;

  constructor(private fb: FormBuilder, private loginService: LoginService, private router:Router) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  registerUser() {
    // if (this.userForm.valid) {
      const user = this.userForm.value;
      this.loginService.addUser(user).subscribe(
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
    // }
  
  }
}
