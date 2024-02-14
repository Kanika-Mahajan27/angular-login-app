import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  BASE_URL = "https://api.dicebear.com/7.x/initials/png?seed=";
  constructor(private http : HttpClient) { }

  generateAvatar(intials : string){
    return this.http.get(this.BASE_URL + intials,{ responseType: 'blob' });
  }
}
