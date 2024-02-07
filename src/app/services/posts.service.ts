import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PostPage } from '../model/post-page.model';
import { Observable, of } from 'rxjs';
import { Post } from '../model/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private BASE_URL = "http://localhost:8086/posts";
  likedPosts : string[] = [];
  totalLikes! : number;
  constructor(private httpClient : HttpClient) { }

  getPosts(page : number , size : number){
    const headers =  new HttpHeaders().set("Authorization",`Bearer ${localStorage.getItem("authToken")}`);
    return this.httpClient.get<PostPage>(`${this.BASE_URL}?page=${page}&size=${size}&feed=all`,{headers});
  }

  getPostDetails(postId: string):Observable<Post>{
    const headers = new HttpHeaders().set("Authorization", `Bearer ${localStorage.getItem("authToken")}`);
    return this.httpClient.get<Post>(`${this.BASE_URL}/${postId}`, {headers});
  }

  likePost(postId: string): Observable<any> {
    
    if (this.likedPosts.includes(postId)) {
      return of(); // Return an observable that immediately completes
    }
    const headers = new HttpHeaders().set("Authorization", `Bearer ${localStorage.getItem("authToken")}`);
    return this.httpClient.put<any>(`${this.BASE_URL}/${postId}/like`, {} , { headers});
    
  }

  trackLikedPosts(postId:string){
    this.likedPosts.push(postId);
  }
}
