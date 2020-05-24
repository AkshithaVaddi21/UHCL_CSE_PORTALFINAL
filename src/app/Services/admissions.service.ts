import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AdmissionsService {
  selectedStudent:any;
  selectedStudentSubject:BehaviorSubject<any>=new BehaviorSubject(null);
  constructor() { }
  setDataFromAdmissionsList(selectedStudent){
    this.selectedStudent = selectedStudent;
//opening and putting data
//console.log(this.selectedMeeting);
this.selectedStudentSubject.next(this.selectedStudent);

  }
  getSelectedStudentObj(){
    //broadcasting where ever opening is find.
         return this.selectedStudentSubject.asObservable();
      }
}
