import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedAdmissionComponent } from './detailed-admission.component';

describe('DetailedAdmissionComponent', () => {
  let component: DetailedAdmissionComponent;
  let fixture: ComponentFixture<DetailedAdmissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedAdmissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedAdmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
