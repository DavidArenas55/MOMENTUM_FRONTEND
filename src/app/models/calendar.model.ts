export interface Calendar {
  _id: string,
  owner: string,
  calendarName: string,
  appointments: [],
  invitees: [],
  isDeleted?: boolean;
}

export interface CalendarMessage {
  message: string,
  calendars: Calendar[],
}