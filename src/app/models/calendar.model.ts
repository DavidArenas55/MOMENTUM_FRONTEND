export interface Calendar {
  _id: string,
  owner: string,
  calendarName: string,
  appointments: string[],
  invitees: string[],
}

export interface CalendarMessage {
  message: string,
  calendars: Calendar[],
}