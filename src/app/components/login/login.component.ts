import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/model/user';
import { LoginService } from 'src/app/services/login.service';
import { OtpService } from 'src/app/services/otp.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OtpComponent } from '../otp/otp.component';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user = new User();
  msg='';
  otpRequired : boolean = false;
  loginSuccess: boolean = false;
  loginError: boolean = false;
  email:string="";
  otpSent:boolean = false;
  linkedInCred = {
    clientID : "86h5om06u16k4b",
    redirectUri : "http://localhost:4200/linkedInLogin",
    scope : "email%20profile%20openid"
  }
  loginform: FormGroup = new FormGroup({
    email: new FormControl({ value: '', disabled: false },[Validators.required, Validators.minLength(6), Validators.maxLength(25), Validators.pattern(/^\S+@\S+\.\S+$/)]),
    password: new FormControl({ value: '', disabled: false },[Validators.required, Validators.minLength(4), Validators.maxLength(20), ])
  });
  activatedRoute: any;

  get emailVal(){
    return this.loginform.get('email');
  }

  get passVal(){
    return this.loginform.get('password');
  }

  constructor(private _service:LoginService, private _router :Router, private route: ActivatedRoute, private otpService:OtpService){}
  
  // ngOnInit(): void {
  //   // Call the method to handle the OAuth callback
  //   this._service.handleOAuthCallback();
  // }

  ngOnInit(): void {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        const params = new URLSearchParams(fragment);
        const accessToken = params.get('access_token');

        if (accessToken) {
          console.log('Access Token:', accessToken);
        }
      }
    });
  }
  
  loginUser(){
    this._service.loginUserFromRemote(this.user).subscribe(
      data => {        
        localStorage.setItem("loggedUser",JSON.stringify(data));
        this.otpRequired=true;
        this.loginSuccess = true;
        
        this.email=this.loginform.value.email;
        // this._router.navigate(['/otp'])
        this.loginform.get(this.email)?.disable();
        this.loginform.get('password')?.disable();
        this.otpService.sendOtp(this.email).subscribe(
          (response) => {
            if (response=="OTP sent successfully") {
              this.otpSent = true;
              console.log('Server response:', response);
              // alert(response); 
            } else {
              console.log('Server response:', response);
              alert('Failed ');
            }
          },
          (error) => {
            // Handle error
            console.log(error);
            alert('Failed to send OTP. Please try again.');
          }
        );
        this.otpSent=true;
        // setTimeout(() => {
        //   this.loginSuccess = false;
        // }, 2000);
    },
      error => {
        console.log("exception occured");
        this.loginError=true;

        setTimeout(() => {
          this.loginError = false;
        }, 2000);
      }
    );
  }

  logout(): void {
    // Remove the token from local storage
    localStorage.removeItem('authToken');

  }
  loginWithGoogle(){
    this._service.loginWIthGoogle();
  }
  loginWithLinkedIn() {
    window.location.href = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${this.linkedInCred.clientID}&redirect_uri=${this.linkedInCred.redirectUri}&state=example&scope=${this.linkedInCred.scope}`
  }
}

