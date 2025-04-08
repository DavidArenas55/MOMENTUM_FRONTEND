import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public static apiUrl = 'http://localhost:8080/'; // URL de tu backend

  constructor(private http: HttpClient) {}

  // LOGIN
  login(credentials: { name_or_mail: string; password: string }): Observable<any> {
    return this.http.post<{ accessToken: string }>(
      AuthService.apiUrl + 'users/login',
      credentials,
      { withCredentials: true } // Para enviar y recibir la cookie del refresh token
    ).pipe(
      tap((res) => {
        localStorage.setItem('accessToken', res.accessToken);
      })
    );
  }

  // LOGOUT
  logout(): Observable<any> {
    const accessToken = localStorage.getItem('accessToken');
    return this.http.post(AuthService.apiUrl + 'users/logout', {}, {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true
    }).pipe(
      tap(() => {
        localStorage.removeItem('accessToken');
      })
    );
  }

  // REFRESH TOKEN
  refreshToken(): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(
      AuthService.apiUrl + 'users/refresh',
      {},
      { withCredentials: true }
    ).pipe(
      tap((res) => {
        localStorage.setItem('accessToken', res.accessToken);
      })
    );
  }

  // Verifica si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  // Obtener token
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // Usuarios
  getUsers(page: number, limit: number): Observable<any> {
    return this.http.get(AuthService.apiUrl + "users", {
      params: {
        getDeleted: true,
        page: page,
        limit: limit,
      }
    });
  }
  deleteUsers(usersIds: string[]): Observable<any> {
    return this.http.patch(AuthService.apiUrl +'users/soft', { usersIds }, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  restoreUser(userId: string): Observable<any> {
    return this.http.patch(AuthService.apiUrl +`users/${userId}/restore`,{}, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  userUpdate(userId: string, userData: Partial<{ mail: string; password: string }>): Observable<User> {
    return this.http.put<User>(AuthService.apiUrl + `users/${userId}`, userData, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getUserById(userId: string) {
    return this.http.get<User>(`http://localhost:8080/api/users/${userId}`);
  }
}