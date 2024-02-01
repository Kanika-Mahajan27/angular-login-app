import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {

  constructor(private activatedRoute : ActivatedRoute ){}

  ngOnInit(){
    this.activatedRoute.queryParams.subscribe(params => {
    const access_token = params['access_token'];
    if (access_token) {
      localStorage.setItem("access_token", access_token);
    }
  });
}
}
