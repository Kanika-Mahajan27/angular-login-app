import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-linkedin-login',
  templateUrl: './linkedin-login.component.html',
  styleUrls: ['./linkedin-login.component.css']
})
export class LinkedinLoginComponent {

  constructor(private activatedRoute: ActivatedRoute, private loginService :  LoginService,private router:Router){

  }

  ngOnInit(){
    this.activatedRoute.queryParams.subscribe( params => {
      const code = params['code'];
      if (code){
        this.exchangeCodeForToken(code);
      }
    })
  }
  exchangeCodeForToken(code: string) {
    this.loginService.handleLinkedInLogin(code).subscribe({
      next : (res : any) => {
        console.log(res);
        
        localStorage.setItem("authToken",res["token"]);
        this.loginService.storeLoggedUser(res["user"]);
        this.loginService.loggedUser = res["user"];
        this.router.navigate(['/home']);
      },
      error : (err : HttpErrorResponse)=>{
        console.error(err);
      }
    }
    )
  }
}
