import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/users/login'; // URL de tu backend

  constructor(private http: HttpClient) {}

  login(credentials: { name: string; password: string }): Observable<any> {
    return this.http.post(this.apiUrl, credentials);
  }
}
