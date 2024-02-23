import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
@Component({
  selector: 'app-back',
  templateUrl: './back.component.html',
  styleUrls: ['./back.component.css']
})
export class BackComponent {
  showBackComponent: boolean = true;

  constructor(private router: Router,private location : Location) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showBackComponent = !['/home', '/login', '/register'].includes(event.url);
      }
    });
  }
  goBack(){
    this.location.back();
  }


}
