import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../model/user';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class LoginService {


  constructor(private _http:HttpClient, private router: Router) {
    
   }

  loggedUser: User | null =null;
  BASE_URL = 'http://localhost:8088';

  public loginUserFromRemote(user: User):Observable<any>{
    const url= this.BASE_URL+'/user/login';
    return this._http.post<any>(url,user).pipe(
      map((res: any) => {
        console.log('Server Response:', res);
        this.loggedUser=res.user;
        console.log(this.loggedUser);
        // this.storeLoggedUser(res.user);
      return res.user;
    })
    );
  }

  //store logged user in local storage
  storeLoggedUser(user: Object) {
    localStorage.setItem('loggedUser', JSON.stringify(user));
  }

  getLoggedUser() {
    return this.loggedUser;
  }
  
  isLoggedIn() {
    const user = this.getLoggedUser();
    if(user!= null || user != undefined){
      return true;
    }
    else{
      return false;
    }
  }

  logoutUser(): void {
    // Remove the token from local storage
    localStorage.removeItem('authToken');
    // localStorage.removeItem('loggedUser');
    this.loggedUser=null;
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    // Check if the token exists in local storage or implement your authentication logic
    return !!localStorage.getItem('authToken');
  }

  addUser(user: any): Observable<any> {
    return this._http.post(`${this.BASE_URL}/user/addNewUser`, user);
  }

  loginWIthGoogle(){
    // return this._http.get(`${this.BASE_URL}/oauth2/authorization/google`)
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?scope=email&include_granted_scopes=true&response_type=token&state=state_parameter_passthrough_value&redirect_uri=http://localhost:4200&client_id=199698056770-10dvjm456v1ri8onlpb4evd8d31gnedn.apps.googleusercontent.com`;
  }

  handleOAuthCallback(): void {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('access_token');
  
    if (token) {
      // Token received, you can store it or use it as needed
      console.log('Access Token:', token);
  
      // Redirect to the home page or any other route
      this.router.navigate(['/home']);
    } else {
      // Handle the case where the access token is not present
      console.error('Access Token not found in the callback');
    }
  }

  handleLinkedInLogin(code : string){
    return this._http.get(`${this.BASE_URL}/user/linkedin-auth?code=${code}`);
  }
}
