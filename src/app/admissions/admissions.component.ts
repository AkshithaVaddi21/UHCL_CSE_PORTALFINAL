import { AngularFireStorage } from '@angular/fire/storage';
import { element } from 'protractor';
import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit,ViewChild } from '@angular/core';
import { AdmissionsModel } from '../Models/AdmissionsModel';
import { AuthorizationServiceService } from '../Services/authorization-service.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {ConfirmationService} from 'primeng/api';
import { FileService } from '../Services/file.service';
import { AdmissionsService } from '../Services/admissions.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-admissions',
  templateUrl: './admissions.component.html',
  styleUrls: ['./admissions.component.css']
})
export class AdmissionsComponent implements OnInit {
admissionsModelObject=new AdmissionsModel();
showAddStudentApplicationForm:boolean;
greVerbalPossibleScore=[];
greTotalPossibleScore=[];
greEssayPossibleScore=[];
  loggedInUserDataFromDB: any={};
  studentIdsForValidation=[];
  applicants: MatTableDataSource<any>;
  statusOptions=['Sent for Review-Color:White','Under Review-Color:Brown','Accepted-Color:Green','Rejected-Color:Red']
  statusOptions1:any[];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns: string[] = ['Action','studentId','firstName', 'lastName', 'greVerbalScore','greQuantScore','greTotalScore','greEssayScore','intendedProgram','gpa','status','date'];
  editClicked: boolean;
  tempStudent: any={};
  constructor(private db: AngularFirestore,private authorizationService: AuthorizationServiceService,private storage: AngularFireStorage,private confirmationService: ConfirmationService,private fileService:FileService, private admissionsService:AdmissionsService, private route:Router,private datePipe: DatePipe) {
    this.showAddStudentApplicationForm=false;
    this.admissionsModelObject.daysForEmailAlert='2';
    for(let i=130; i<171;i++){
      this.greVerbalPossibleScore.push(i);
      this.greTotalPossibleScore.push(i+130);
    }
    for(let j=0;j<6.5;j=j+0.5){
      this.greEssayPossibleScore.push(j);
    }
    this.authorizationService.getUserFromAuthorizationServiceObj().subscribe(data => {
      if(data!=null){
      this.loggedInUserDataFromDB = data;
    }
      //console.log("in nav bar",this.loggedInUserDataFromDB);
      
    });
    this.db.collection("Admissions").valueChanges().subscribe(snap=>{
      //snap=snap.orderBy("date");
      this.applicants=new MatTableDataSource(snap);
      this.applicants.sort = this.sort;
      for(let i=0;i<snap.length;i++){
        this.studentIdsForValidation.push(snap[i]['studentId']);
      }
      
    });
    
   }
  addStudentApplication(){
    this.showAddStudentApplicationForm=true;
  }
  uploadFile(event){
    console.log(event.target.files[0]);
    var timeStamp = Math.floor(Date.now() / 1000).toString(20);
    var randomId = Math.random().toString(36).substring(2);
    randomId = randomId + timeStamp;
    // randomId=randomId+
    this.storage.upload(randomId, event.target.files[0]).snapshotChanges().subscribe(data => {
      //console.log("console.log",data);
      this.storage.ref(randomId).getDownloadURL().subscribe(data=>{
        if(data!=null){
          let downloadUrl = data;
          //this.selectedMeeting.downloadFiles[randomId]=downloadUrl;
          //console.log(this.selectedMeeting.downloadFiles);
          this.admissionsModelObject.downloadApplications.push({
            uniqueNameForReference:randomId,
            linkToView:downloadUrl,
            nameOfFileAsUploaded:event.target.files[0].name,
            typeOfFile:event.target.files[0].type
          })
        }
      });
    });

  }
  open(url){
    window.open(url,"_blank");
  }
  deleteFile(ref1,i){
    this.confirmationService.confirm({
      message: 'Are you sure, do you want to delete this File?',
      header:ref1,
      accept: () => {
    //console.log(ref1,i);
    var deleteRef = this.storage.ref(ref1)

    // Delete the file
    deleteRef.delete()
    //this.selectedMeeting.downloadFiles.
    //const index: number = this.selectedMeeting.downloadFiles.indexOf(ref1);
     if (i !== -1) {
     this.admissionsModelObject.downloadApplications.splice(i, 1);
     
     }
    //this.db.collection("Meetings").doc(this.selectedMeeting.documentIdOfCurrentMeeting).update({ downloadFiles: this.selectedMeeting.downloadFiles });
  }
});

  }
  downloadFile(uniqueNameForReference,linkToView,typeOfFile){
    this.fileService.setHttpRequestToDownloadFile(uniqueNameForReference,linkToView,typeOfFile); 
     }
  saveAdmissionApplication(){
    //console.log(typeof(this.admissionsModelObject.studentId));
    this.admissionsModelObject.greTotalScore=+(this.admissionsModelObject.greVerbalScore) + +(this.admissionsModelObject.greQuantScore);
    var MMddyyyy = this.datePipe.transform(new Date(),"MM-dd-yyyy");
    if(this.editClicked==true){
      console.log(this.tempStudent.studentId,",",this.admissionsModelObject.studentId);
      console.log(this.tempStudent.studentId!=this.admissionsModelObject.studentId);
      if(this.tempStudent.studentId!=this.admissionsModelObject.studentId){
        this.deleteApplication(this.tempStudent)
        this.tempStudent={};
      }
      this.editClicked=false;
      }
    this.db.collection('Admissions').doc(`${this.admissionsModelObject.studentId}`).set({
      date:MMddyyyy,
      firstName:this.admissionsModelObject.firstName,
      lastName:this.admissionsModelObject.lastName,
      studentId:this.admissionsModelObject.studentId,
      greVerbalScore:this.admissionsModelObject.greVerbalScore,
      greQuantScore:this.admissionsModelObject.greQuantScore,
      greTotalScore:`${this.admissionsModelObject.greTotalScore}`,
      greEssayScore:this.admissionsModelObject.greEssayScore,
      intendedProgram:this.admissionsModelObject.intendedProgram,
      gpa:this.admissionsModelObject.gpa,
      //intendedValidators:this.admissionsModelObject.intendedValidators,
      uploadedBy:this.loggedInUserDataFromDB.emailId,
      accepts:this.admissionsModelObject.accepts,
      rejects:this.admissionsModelObject.rejects,
      comments:[],
      status:"Sent for Review",
      rejectionReasonsFromModel:{},
      downloadApplications:this.admissionsModelObject.downloadApplications,
      dateOfLastEmailSent:Date.now(),
      //daysForEmailAlert:+(this.admissionsModelObject.daysForEmailAlert)*86400000
      daysForEmailAlert:this.admissionsModelObject.daysForEmailAlert
    })
    
    this.editClicked=false;
    this.showAddStudentApplicationForm=false;
    this.admissionsModelObject=new AdmissionsModel();
  }
  cancel(){
    this.showAddStudentApplicationForm=false;
    this.editClicked=false;
    this.admissionsModelObject=new AdmissionsModel();
  }
  editButtonClicked(element){
    this.editClicked=true;
    this.tempStudent=element;
    
    this.admissionsModelObject=element;
    //this.admissionsModelObject.intendedValidators.setValue(element.intendedValidators);
    this.showAddStudentApplicationForm=true;

  }
  deleteApplication(element){
    this.confirmationService.confirm({
      message: 'Are you sure, do you want to delete this Student Application?',
      header:`${element.studentId}`,
      accept: () => { 
    this.db.collection('Admissions').doc(`${element.studentId}`).delete()
    .then(function(){
      console.log("Document Successfull deleted!");
    }).catch(
      function(error){
        console.error("Error removing document:",error);
      }
    );
  }
});
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.applicants.filter = filterValue.trim().toLowerCase();
  }
  getPresentStudentDetails(presentStudent){
    this.admissionsService.setDataFromAdmissionsList(presentStudent)
    this.route.navigate(['DetailedAdmission']);
  }
  ngOnInit() {
    //this.applicants.sort = this.sort;
  }

}
