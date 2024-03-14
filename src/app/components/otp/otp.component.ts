import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { OtpService } from 'src/app/services/otp.service';
import { Router } from '@angular/router';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OtpComponent {
  @Input()
  userEmail!: string;
  otp!: string;
  verificationSuccess: boolean = false;

  constructor(private otpService: OtpService, private fb: FormBuilder,private router: Router, private websocketService: WebSocketService ) {
    this.otpform = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }
  otpSent:boolean = true;
  otpSent1:boolean = false;
  otpform: FormGroup;
  
  requestOtp() {
    this.otpService.sendOtp(this.userEmail).subscribe(
      (response) => {
        if (response=="OTP sent successfully") {
          this.otpSent = true;
          console.log('Server response:', response);
          console.log("Requesting OTP!");
        } else {
          console.log('Server response:', response);
          alert('Failed ');
        }
        setTimeout(() => {
          this.otpSent1=true;
        }, 2000);
      },
      (error) => {
        console.log(error);
        alert('Failed to send OTP. Please try again.');
      }
    );
  }

  get otpVal(){
    return this.otpform.get('otp')?.value;
  }

  verifyOtp() {
    const enteredOtp = this.otpform.value.otp;
    console.log(this.otpform);
    this.otpService.verifyOtp(this.userEmail, enteredOtp).subscribe(
      (response) => {
        if (response) {
          this.verificationSuccess = true;
          localStorage.setItem('authToken', response);
          this.websocketService.join();
          this.router.navigate(['/setup']);
          
        } else {
          localStorage.removeItem("loggedUser")
          alert('Failed to verify OTP. Please try again.');
        }
      },
      (error) => {
        console.log(error);
        alert('Failed to verify OTP. Please try again.');
      }
    );
  }

}
