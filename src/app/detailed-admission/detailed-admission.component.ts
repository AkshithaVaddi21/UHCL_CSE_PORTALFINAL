import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import { AdmissionsService } from '../Services/admissions.service';
import { FileService } from '../Services/file.service';
import { AdmissionsModel } from '../Models/AdmissionsModel';
import { AuthorizationServiceService } from '../Services/authorization-service.service';
import { ConfirmationService } from 'primeng/api';
@Component({
  selector: 'app-detailed-admission',
  templateUrl: './detailed-admission.component.html',
  styleUrls: ['./detailed-admission.component.css']
})
export class DetailedAdmissionComponent implements OnInit {
  selectedStudent: any;
  showCommentSection: boolean = false;
  commentText: string;
  admissionsModelObject = new AdmissionsModel();
  loggedInUserDataFromDB: any;
  buttonValue: any;
  rejectionReasons: any = [];
  rejectionPossibleReasons = ['GRE Total too low', 'Verbal below 140', 'Quant below 150', 'GPA too low', 'Weak academic performance in foundation', 'Inadeqaute preparation for the MS program']
  showRejectOptions: boolean = false;
  rejectClicked: boolean = true;
  constructor(private admissionsService: AdmissionsService, private fileService: FileService, private db: AngularFirestore, private authorizationService: AuthorizationServiceService, private confirmationService: ConfirmationService) {
    this.authorizationService.getUserFromAuthorizationServiceObj().subscribe(data => {
      this.loggedInUserDataFromDB = data;
      //console.log("in nav bar",this.loggedInUserDataFromDB);

    });
  }
  open(url) {
    window.open(url, "_blank");
  }
  downloadFile(uniqueNameForReference, linkToView, typeOfFile) {
    this.fileService.setHttpRequestToDownloadFile(uniqueNameForReference, linkToView, typeOfFile);
  }
  acceptAdmission(event) {
    this.confirmationService.confirm({
      message: 'Are you sure, do you want to Accept Admission? You can provide some optional Prerequisities below',
      header: this.selectedStudent.studentId,
      accept: () => {
        this.showRejectOptions = false;
        this.buttonValue = event.srcElement.value;
        //console.log("hai")
        if (!this.selectedStudent.accepts.includes(this.loggedInUserDataFromDB.emailId)) {
          this.selectedStudent.accepts.push(this.loggedInUserDataFromDB.emailId);

        }
        if (this.selectedStudent.rejects.includes(this.loggedInUserDataFromDB.emailId)) {
          this.selectedStudent.rejects.splice(this.selectedStudent.rejects.indexOf(this.loggedInUserDataFromDB.emailId), 1);
        }
        if (this.selectedStudent.accepts.length > 1) {
          this.selectedStudent.status = 'Accepted';
        }
        else {
          if (this.selectedStudent.rejects.length > 1) {
            this.selectedStudent.status = 'Rejected';
          }
          else {
            this.selectedStudent.status = 'Under Review';
          }
        }
        if(this.loggedInUserDataFromDB.emailId in this.selectedStudent.rejectionReasonsFromModel){
          //console.log("Hi")
          delete this.selectedStudent.rejectionReasonsFromModel[this.loggedInUserDataFromDB.emailId];
        }
        this.showCommentSection = true;
        this.db.collection("Admissions").doc(`${this.selectedStudent.studentId}`).update({ rejects: this.selectedStudent.rejects, accepts: this.selectedStudent.accepts, status: this.selectedStudent.status,rejectionReasonsFromModel: this.selectedStudent.rejectionReasonsFromModel})

      }
    });

  }
  saveComment() {
    //this.selectedStudent.comments.push({comment:this.commentText, decision:this.buttonValue, commentedBy:this.loggedInUserDataFromDB.emailId})
    this.showCommentSection = false;
    if (this.commentText != null) {
      if (this.selectedStudent.comments.length > 0) {
        for (let i = 0; i < this.selectedStudent.comments.length; i++) {
          if (this.loggedInUserDataFromDB.emailId == this.selectedStudent.comments[i].commentedBy) {
            this.selectedStudent.comments.splice(i, 1);
            this.selectedStudent.comments.push({ comment: this.commentText, decision: this.buttonValue, commentedBy: this.loggedInUserDataFromDB.emailId })
          }
          else {
            this.selectedStudent.comments.push({ comment: this.commentText, decision: this.buttonValue, commentedBy: this.loggedInUserDataFromDB.emailId })
          }
        }
      }
      else {
        this.selectedStudent.comments.push({ comment: this.commentText, decision: this.buttonValue, commentedBy: this.loggedInUserDataFromDB.emailId })

      }

      this.db.collection("Admissions").doc(`${this.selectedStudent.studentId}`).update({ comments: this.selectedStudent.comments })
    }
  }
  rejectAdmission() {
    this.confirmationService.confirm({
      message: 'Are you sure, do you want to Reject Admission for this student? You need to select reasons below',
      header: this.selectedStudent.studentId,
      accept: () => {
        this.showCommentSection = false;
        
        this.showRejectOptions = true;
      }
    });
  }
  saveRejectionReasons(event) {
    this.confirmationService.confirm({
      message: 'Are you sure, do you want to Reject Admission for this student?',
      header: this.selectedStudent.studentId,
      accept: () => {
        if (this.rejectClicked == true) {
          this.buttonValue = event.srcElement.value;
          if (!this.selectedStudent.rejects.includes(this.loggedInUserDataFromDB.emailId)) {
            this.selectedStudent.rejects.push(this.loggedInUserDataFromDB.emailId);

          }
          if (this.selectedStudent.accepts.includes(this.loggedInUserDataFromDB.emailId)) {
            this.selectedStudent.accepts.splice(this.selectedStudent.accepts.indexOf(this.loggedInUserDataFromDB.emailId), 1);
          }
          //this.selectedStudent.rejects.push(this.loggedInUserDataFromDB.emailId);
          this.selectedStudent.rejectionReasonsFromModel[this.loggedInUserDataFromDB.emailId] = this.buttonValue+'-->'+this.rejectionReasons;
          if (this.selectedStudent.rejects.length > 1) {
            this.selectedStudent.status = 'Rejected';
          }
          else {
            if (this.selectedStudent.accepts.length > 1) {
              this.selectedStudent.status = 'Accepted';
            }
            else {
              this.selectedStudent.status = 'Under Review';
            }
          }
          for (let i = 0; i < this.selectedStudent.comments.length; i++) {
            if (this.loggedInUserDataFromDB.emailId == this.selectedStudent.comments[i].commentedBy) {
              this.selectedStudent.comments.splice(i, 1);
            }
          }
          this.db.collection("Admissions").doc(`${this.selectedStudent.studentId}`).update({ rejectionReasonsFromModel: this.selectedStudent.rejectionReasonsFromModel, rejects: this.selectedStudent.rejects, accepts: this.selectedStudent.accepts, status: this.selectedStudent.status,comments: this.selectedStudent.comments})
        }
      }
    });
  }
  ngOnInit() {
    this.admissionsService.getSelectedStudentObj().subscribe(data => {
      this.selectedStudent = data;
    });
    //console.log(this.selectedStudent);
  }

}
