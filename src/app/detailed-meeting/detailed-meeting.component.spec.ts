import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedMeetingComponent } from './detailed-meeting.component';

describe('DetailedMeetingComponent', () => {
  let component: DetailedMeetingComponent;
  let fixture: ComponentFixture<DetailedMeetingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedMeetingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
