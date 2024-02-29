import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommentPage } from '../model/comment-page.model';
import { Comment } from '../model/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  BASE_URL : string = "http://localhost:8182/comments"
  constructor(private http : HttpClient) { }

  addComment(comment : any){
    const headers =  new HttpHeaders().set("Authorization",`Bearer ${localStorage.getItem("authToken")}`);
    return this.http.post<Comment>(`${this.BASE_URL}`,comment,{headers});
  }

  getComments(postId : string , page : number ,size : number ){
    const headers =  new HttpHeaders().set("Authorization",`Bearer ${localStorage.getItem("authToken")}`);
    return this.http.get<CommentPage>(`${this.BASE_URL}/post/${postId}?page=${page}&size=${size}`,{headers});
  }

  getCommentCount(postId : string){
    const headers =  new HttpHeaders().set("Authorization",`Bearer ${localStorage.getItem("authToken")}`);
    return this.http.get<number>(`${this.BASE_URL}/count?postId=${postId}`,{headers});
  }

  deleteComment(commentId : string){
    const headers =  new HttpHeaders().set("Authorization",`Bearer ${localStorage.getItem("authToken")}`);
    return this.http.delete(`${this.BASE_URL}/${commentId}`,{headers});
  }
}
