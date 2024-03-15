import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PostPage } from '../model/post-page.model';
import { Observable, of } from 'rxjs';
import { Post } from '../model/post.model';
import { PostDetails } from '../model/post-details.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private BASE_URL = environment.postServiceUrl;
  likedPosts : string[] = [];
  totalLikes! : number;
  constructor(private httpClient : HttpClient) { }

  getPosts(page : number , size : number,feed : string){
    const headers =  new HttpHeaders().set("Authorization",`Bearer ${localStorage.getItem("authToken")}`);
    return this.httpClient.get<PostPage>(`${this.BASE_URL}?page=${page}&size=${size}&feed=${feed}`,{headers});
  }

  getPostDetails(postId: string):Observable<PostDetails>{
    const headers = new HttpHeaders().set("Authorization", `Bearer ${localStorage.getItem("authToken")}`);
    return this.httpClient.get<PostDetails>(`${this.BASE_URL}/${postId}?includeComments=true`, {headers});
  }

  likePost(postId: string): Observable<any> {
    
    if (this.likedPosts.includes(postId)) {
      return of(); // Return an observable that immediately completes
    }
    const headers = new HttpHeaders().set("Authorization", `Bearer ${localStorage.getItem("authToken")}`);
    return this.httpClient.put<any>(`${this.BASE_URL}/${postId}/like`, {} , { headers});
    
  }

  getPostsOfAuthor(page : number , size : number , author : string){
    const headers =  new HttpHeaders().set("Authorization",`Bearer ${localStorage.getItem("authToken")}`);
    return this.httpClient.get<PostPage>(`${this.BASE_URL}?page=${page}&size=${size}&feed=${author}`,{headers});
  }

  createPost(post: any){
    const headers =  new HttpHeaders().set("Authorization",`Bearer ${localStorage.getItem("authToken")}`);
    return this.httpClient.post<Post>(`${this.BASE_URL}`,post,{headers});
  }

  trackLikedPosts(postId:string){
    this.likedPosts.push(postId);
  }
  
  deletePost(postId : string){
    const headers =  new HttpHeaders().set("Authorization",`Bearer ${localStorage.getItem("authToken")}`);
    return this.httpClient.delete(`${this.BASE_URL}/${postId}`,{headers});
  }
}
