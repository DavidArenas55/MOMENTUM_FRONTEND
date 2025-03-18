import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { CalendarMessage } from '../models/calendar.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarsService {

  constructor(private http: HttpClient) { }

  getCalendars(userId: string): Observable<CalendarMessage> {
    return this.http.get<CalendarMessage>(AuthService.apiUrl + "calendars/" + userId);
  }
}
