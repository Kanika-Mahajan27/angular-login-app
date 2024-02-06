import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PostPage } from '../model/post-page.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private BASE_URL = "http://localhost:8086/posts";
  constructor(private httpClient : HttpClient) { }

  getPosts(page : number , size : number){
    const headers =  new HttpHeaders().set("Authorization",`Bearer ${localStorage.getItem("authToken")}`);
    return this.httpClient.get<PostPage>(`${this.BASE_URL}?page=${page}&size=${size}&feed=all`,{headers});
  }
}
