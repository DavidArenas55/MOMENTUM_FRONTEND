import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { CalendarMessage, Calendar } from '../models/calendar.model';
import { Observable } from 'rxjs';
import { APP_CONFIG, Config } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class CalendarsService {

  constructor(private http: HttpClient, @Inject(APP_CONFIG) readonly config: Config) { }

  getCalendars(userId: string): Observable<CalendarMessage> {
    return this.http.get<CalendarMessage>(this.config.apiUrl + "/calendars/" + userId);
  }
  createCalendar(Data:Partial<Calendar>): Observable<Calendar> {
    return this.http.post<Calendar>(this.config.apiUrl + "/calendars/", Data);
  }
  deleteCalendar(CalendarId: string): Observable<Calendar> {
    return this.http.patch<Calendar>(
      this.config.apiUrl + "/calendars/" + CalendarId + "/soft-delete",
      {}
    );
  }

  editCalendar(calendarId: string, changes: Partial<Calendar>): Observable<Calendar> {
    return this.http.patch<Calendar>(
      this.config.apiUrl + "/calendars/" + calendarId,
      changes,
    );
  }
}
