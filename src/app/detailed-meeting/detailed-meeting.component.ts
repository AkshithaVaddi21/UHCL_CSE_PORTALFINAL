import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Component, OnInit } from '@angular/core';
import { CreateMeetingModel } from '../Models/CreateMeetingModel';
import { MeetingService } from '../Services/meeting.service';
import { Router } from '@angular/router';
import { AuthorizationServiceService } from '../Services/authorization-service.service';
import {ConfirmationService} from 'primeng/api';
import {MultiSelect} from 'primeng/multiselect';
import {FormControl} from '@angular/forms';
import {MatSelect} from '@angular/material/select';
import { HttpClient } from '@angular/common/http';

import { DomSanitizer } from '@angular/platform-browser';
import { FileService } from '../Services/file.service';
@Component({
  selector: 'app-detailed-meeting',
  templateUrl: './detailed-meeting.component.html',
  styleUrls: ['./detailed-meeting.component.css']
})
export class DetailedMeetingComponent implements OnInit {
  attendance = new FormControl();
  showDetailedMeeting: boolean = false;
  finalised: boolean = true;
  rejectClicked: boolean = false;
  selectedMeeting: CreateMeetingModel;
  loggedInUserDataFromDB: any = null;
  commentByUser: any[];
  createMeetingModelObject2 = new CreateMeetingModel();
  agendaList: any[];
  editingVariable:boolean=false;
  isempty:boolean = true;
  //lengthOfArrayOfApprovals:number=this.selectedMeeting.approvals
  comment: any;
  downloadURL: any;
  dataForAttendance=[];
  comments= [];
  //attendees:string[]=[];
  //allSelected: any;
  constructor(private meetingService: MeetingService, private storage: AngularFireStorage, private route: Router, private db: AngularFirestore, private authorizationService: AuthorizationServiceService, private confirmationService: ConfirmationService, private http:HttpClient, private sanitizer:DomSanitizer, private fileService:FileService) {
    this.authorizationService.getUserFromAuthorizationServiceObj().subscribe(data => {
      this.loggedInUserDataFromDB = data;
      //console.log("in nav bar",this.loggedInUserDataFromDB);
    });
    db.collection("Users").valueChanges().subscribe(data=>
      {
        //console.log(data);
        this.dataForAttendance=data
    });
  }

  ngOnInit() {
    this.meetingService.getSelectedMeetingObj().subscribe(data => {
      this.selectedMeeting = data;
      if(this.selectedMeeting!=null){
      this.comment = this.selectedMeeting['comments'][this.loggedInUserDataFromDB.emailId];
      this.db.collection("AgendaList").doc(this.selectedMeeting.documentIdOfAgendaListCollection).valueChanges().subscribe(data => this.agendaList = data['wholeAgendaList']);
      //console.log(this.selectedMeeting);
      }
    });
    //this.selectedMeeting.attendees=[];
    //this.downloadURL = this.storage.ref('gs://myfirstdemoforfiredb.appspot.com/bv3556dcnpe14ej6fa1').getDownloadURL();
  }
  showAddMeetingMinutesForm() {
    //console.log(this.agendaList);
    this.db.collection("AgendaList").doc(this.selectedMeeting.documentIdOfAgendaListCollection).update({ wholeAgendaList: this.agendaList });
    //this.route.navigate(['AddMeetingMinutes']);
  }
  saveMeetingMinutesAndSendEmail(){
    this.db.collection("AgendaList").doc(this.selectedMeeting.documentIdOfAgendaListCollection).update({wholeAgendaList: this.agendaList,saveMeetingMinutesAndSendEmail:true});
    this.db.collection("AgendaList").doc(this.selectedMeeting.documentIdOfAgendaListCollection).update({saveMeetingMinutesAndSendEmail:false});


  }
  finaliseMeetingMinutes() {
    this.confirmationService.confirm({
      message: 'Are you sure, do you want to Finalise this Meeting?(You cannot perform any action like edit and delete anymore)',
      header:"Finalise?",
      accept: () => { 
    //this.finalised=true;
    this.selectedMeeting.finalised = true;
    this.db.collection("Meetings").doc(this.selectedMeeting.documentIdOfCurrentMeeting).update({ finalised: true })
      }
  });
  }

  rejectButtonClicked() {
    this.confirmationService.confirm({
      message: 'Are you sure, do you want to Reject this Meeting? Makesure you need to provide a mandatory reason for your Rejection',
      header:this.selectedMeeting.subject,
      accept: () => { 
    this.rejectClicked = true;
  }
});
  }
  approveButtonClicked() {
    if (!this.selectedMeeting.approvals.some((item) => item == this.loggedInUserDataFromDB.emailId)) {
      this.selectedMeeting.approvals.push(this.loggedInUserDataFromDB.emailId);
    }
    if (this.selectedMeeting.rejects.some((item) => item == this.loggedInUserDataFromDB.emailId)) {
      this.selectedMeeting.rejects.splice(this.selectedMeeting.rejects.indexOf(this.loggedInUserDataFromDB.emailId), 1);
    }
    this.db.collection("Meetings").doc(this.selectedMeeting.documentIdOfCurrentMeeting).update({ rejects: this.selectedMeeting.rejects, approvals: this.selectedMeeting.approvals })
  }
  saveComment() {
    //this.commentByUser.append()
    //this
    this.confirmationService.confirm({
      message: 'Are you sure, do you want to Post this Comment?',
      header:this.comment,
      accept: () => { 
    this.rejectClicked = false;
    if (!this.selectedMeeting.rejects.some((item) => item == this.loggedInUserDataFromDB.emailId)) {
      this.selectedMeeting.rejects.push(this.loggedInUserDataFromDB.emailId);
      
    }
    if (this.selectedMeeting.approvals.some((item) => item == this.loggedInUserDataFromDB.emailId)) {
      this.selectedMeeting.approvals.splice(this.selectedMeeting.approvals.indexOf(this.loggedInUserDataFromDB.emailId), 1);
    }
    this.selectedMeeting.comments.push([this.loggedInUserDataFromDB.emailId] +'-->'+this.comment);
    this.db.collection("Meetings").doc(this.selectedMeeting.documentIdOfCurrentMeeting).update({ comments: this.selectedMeeting.comments, rejects: this.selectedMeeting.rejects, approvals: this.selectedMeeting.approvals })
  }
});

  }
  cancelCommentSection() {
    this.rejectClicked = false;
  }

  uploadFile(event) {
    //   const file = event.target.files[0];
    // const filePath = 'name-your-file-path-here';
    // const task = this.storage.upload(filePath, file);
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
          this.selectedMeeting.downloadFiles.push({
            uniqueNameForReference:randomId,
            linkToView:downloadUrl,
            typeOfFile:event.target.files[0].type
          })
          this.db.collection("Meetings").doc(this.selectedMeeting.documentIdOfCurrentMeeting).update({ downloadFiles: this.selectedMeeting.downloadFiles });
        }
      });
    });
  
    //const downloadUrl = this.storage.ref(randomId).getDownloadURL().subscribe(data => console.log(data,"shourya"));
    //console.log(downloadUrl,this.selectedMeeting);
    
    
     //console.log(event.target.files[0].type);
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
     this.selectedMeeting.downloadFiles.splice(i, 1);
     
     }
    this.db.collection("Meetings").doc(this.selectedMeeting.documentIdOfCurrentMeeting).update({ downloadFiles: this.selectedMeeting.downloadFiles });
  }
});

  }
  downloadFile(uniqueNameForReference,linkToView,typeOfFile){
 this.fileService.setHttpRequestToDownloadFile(uniqueNameForReference,linkToView,typeOfFile);
  //   console.log(linkToView);
  // this.http.get(linkToView,{responseType: 'blob' })
  //  .subscribe(data => {
  //   const blob = new Blob([data], { type: 'text' })
  //   saveAs(blob,"filename");

  //});


  
  
  }
  // downLoadFile(data: any, type: string) {
  //   console.log('in download',data,type);
  //   let blob = new Blob([data], { type: type});
  //   let url = window.URL.createObjectURL(blob);
  //   let pwa = window.open(url);
  //   if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
  //       alert( 'Please disable your Pop-up blocker and try again.');
  //   }
  // }
  deleteMeeting() {
    this.confirmationService.confirm({
      message: 'Are you sure, do you want to delete this record?',
      accept: () => { 
    this.db.collection("AgendaList").doc(this.selectedMeeting.documentIdOfAgendaListCollection).delete()
      .then(function () {
        console.log("Document Successfull deleted!");
      }).catch(
        function (error) {
          console.error("Error removing document:", error);
        }
      );
      this.db.collection("Meetings").doc(this.selectedMeeting.documentIdOfCurrentMeeting).delete()
      .then(function () {
        console.log("Document Successfull deleted!");
      }).catch(
        function (error) {
          console.error("Error removing document:", error);
        }
      );
    this.route.navigate(["MeetingsList"]);
  }
});
  }
  editMeeting(){
    // this.selectedMeeting.operation='Edit';
    // this.route.navigate(['CreateMeeting']);
    this.editingVariable=true;
  }
  saveChanges(){
    this.editingVariable=false;
    this.db.collection("Meetings").doc(this.selectedMeeting.documentIdOfCurrentMeeting).update({ subject: this.selectedMeeting.subject, date:this.selectedMeeting.date, time:this.selectedMeeting.time, duration:this.selectedMeeting.duration, facilitatedBy:this.selectedMeeting.facilitatedBy });
  }
open(url){
  window.open(url,"_blank");
}
selectingAllForAttendance(){
  let arr = [];
  arr.push(true);
  this.dataForAttendance.forEach(element => {
    //console.log(element.emailId);
    arr.push(element.emailId);
    
  });
  this.isempty ? this.attendance.setValue(arr):this.attendance.setValue([]);
  this.isempty = false;
  const indext: number = this.attendance.value.indexOf(true);
    if (indext !== -1) {
      this.attendance.value.splice(indext, 1);
     
    }
    const indexf: number = this.attendance.value.indexOf(false);
    if (indexf !== -1) {
      this.attendance.value.splice(indexf, 1);
     
    }
  //console.log("array",this.attendance.value); 
}
updatingAttendanceToDataBase(){
  //console.log("MouseOUT");
  
    for(let i=0; i<this.attendance.value.length; i++){
      if(!this.selectedMeeting.attendees.includes(this.attendance.value[i])){
          this.selectedMeeting.attendees.push(this.attendance.value[i]);
      }
    }
    this.db.collection("Meetings").doc(this.selectedMeeting.documentIdOfCurrentMeeting).update({ attendees: this.selectedMeeting.attendees });
    
}


}





