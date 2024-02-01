import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-username-form',
  templateUrl: './username-form.component.html',
  styleUrls: ['./username-form.component.css']
})
export class UsernameFormComponent {
  username: string = '';
  usernameForm!: FormGroup;
  constructor(private webSocketService:WebSocketService, private formBuilder: FormBuilder,private router: Router){
    this.usernameForm=this.formBuilder.group({
      username:['', [Validators.required]]
    });
  }

  connect(): void {
    if (this.usernameForm.valid) {
      const username = this.usernameForm.value.username;
      this.webSocketService.username=username;
      this.webSocketService.join(username);
      // this.webSocketService.connect(username);
      this.router.navigate(['/chatbox']);
    }
  }


  /*
  connect(event: Event) {
    event.preventDefault(); // Prevent the default form submission

    this.webSocketService.connect(
      this.username,
      () => {
        // Connection successful
        // For demonstration purposes, redirecting to a chat route
        this.router.navigate(['/chatbox', this.username]);
      },
      (error: string) => {
        // Handle connection error
        console.error('WebSocket connection error:', error);
      }
    );
  }
  */

  // connect() {
  //   // Access form value directly
  //   const username = this.usernameForm.value.username;

  //   this.webSocketService.connect(
  //       username,
  //       () => {
  //           // Connection successful
  //           // For demonstration purposes, redirecting to a chat route
  //           this.router.navigate(['/chatbox', username]);
  //       },
  //       (error: string) => {
  //           // Handle connection error
  //           console.error('WebSocket connection error:', error);
  //       }
  //   );
  //     }



}
