import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardBusinessComponent } from './dashboard-business.component';

describe('DashboardBusinessComponent', () => {
  let component: DashboardBusinessComponent;
  let fixture: ComponentFixture<DashboardBusinessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardBusinessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
