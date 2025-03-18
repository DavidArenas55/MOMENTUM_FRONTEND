import { TestBed } from '@angular/core/testing';

import { CalendarsService } from './calendars.service';

describe('CalendarsService', () => {
  let service: CalendarsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalendarsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
