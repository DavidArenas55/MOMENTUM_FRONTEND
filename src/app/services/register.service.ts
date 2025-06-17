import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG, Config } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient, @Inject(APP_CONFIG) readonly config: Config) {}

  register(credentials: { name: string; age: number; mail: string ; password: string }): Observable<any> {
    return this.http.post(this.config.apiUrl + "/users", credentials);
  }

}
