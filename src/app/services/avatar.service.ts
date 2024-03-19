import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  BASE_URL = environment.avatarServiceUrl;
  constructor(private http : HttpClient) { }

  generateAvatar(intials : string){
    return this.http.get(this.BASE_URL + intials,{ responseType: 'blob' });
  }
}
