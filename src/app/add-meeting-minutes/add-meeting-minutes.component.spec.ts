import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMeetingMinutesComponent } from './add-meeting-minutes.component';

describe('AddMeetingMinutesComponent', () => {
  let component: AddMeetingMinutesComponent;
  let fixture: ComponentFixture<AddMeetingMinutesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMeetingMinutesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMeetingMinutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
