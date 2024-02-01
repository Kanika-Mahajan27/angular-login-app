import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OtpService {

  private baseUrl = 'http://localhost:8088';
  otpVerified: boolean=false;
  constructor(private http: HttpClient) { }


  sendOtp(email: string): Observable<any> {
    const emailRequest = { email };
    const headers = { 'Content-Type': 'application/json' };
    const body = JSON.stringify(emailRequest);
    return this.http.post(`${this.baseUrl}/otp/send`, body, { headers, responseType: 'text' });
}

  verifyOtp(email: string, enteredOtp: string): Observable<any> {
    const body = JSON.stringify({ email, enteredOtp });
    console.log("body:",body);
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post(`${this.baseUrl}/otp/verify`, body, { headers, responseType: 'text' }).pipe(
      tap((response) => {
        // If the response is successful, set otpVerified to true
        this.otpVerified = true;
      })
    );
    // return this.http.post(`${this.baseUrl}/otp/verify`, body, { headers, responseType: 'text' });
  }

}
