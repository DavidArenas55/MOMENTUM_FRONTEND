import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { CalendarMessage, Calendar } from '../models/calendar.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarsService {

  constructor(private http: HttpClient) { }

  getCalendars(userId: string): Observable<CalendarMessage> {
    return this.http.get<CalendarMessage>(AuthService.apiUrl + "calendars/" + userId);
  }
  createCalendar(Data:Partial<Calendar>): Observable<Calendar> {
    return this.http.post<Calendar>(AuthService.apiUrl + "calendars/", Data);
  }
  deleteCalendar(CalendarId: string): Observable<Calendar> {
    return this.http.patch<Calendar>(
      AuthService.apiUrl + "calendars/" + CalendarId + "/soft-delete",
      {}
    );
  }

  editCalendar(calendarId: string, changes: Partial<Calendar>): Observable<Calendar> {
    return this.http.patch<Calendar>(
      AuthService.apiUrl + "calendars/" + calendarId,
      changes,
    );
  }
}
