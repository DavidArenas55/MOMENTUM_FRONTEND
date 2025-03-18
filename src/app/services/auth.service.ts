import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public static apiUrl = 'http://localhost:8080/'; // URL de tu backend

  constructor(private http: HttpClient) {}

  login(credentials: { name_or_mail: string; password: string }): Observable<any> {
    return this.http.post(AuthService.apiUrl + "users/login", credentials);
  }
  getUsers(page: number, limit: number): Observable<any> {
    return this.http.get(AuthService.apiUrl + "users", {
      params: {
        getDeleted: true,
        page: page,
        limit: limit,
      }
    });
  }
  deleteUsers(usersMails: string[]): Observable<any> {
    return this.http.patch(AuthService.apiUrl +'users/soft', { usersMails }, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
