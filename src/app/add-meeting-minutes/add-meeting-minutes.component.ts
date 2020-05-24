import { Component, OnInit } from '@angular/core';
import { CreateMeetingModel } from '../Models/CreateMeetingModel';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { MeetingService } from '../Services/meeting.service';
@Component({
  selector: 'app-add-meeting-minutes',
  templateUrl: './add-meeting-minutes.component.html',
  styleUrls: ['./add-meeting-minutes.component.css']
})
export class AddMeetingMinutesComponent implements OnInit {
createMeetingModelObject=new CreateMeetingModel();
selectedMeeting:CreateMeetingModel;
  agendaList: any;
  constructor(private db:AngularFirestore, private route:Router,private meetingService:MeetingService) { }

  ngOnInit() {
    this.meetingService.getSelectedMeetingObj().subscribe(data => {
      this.selectedMeeting = data;
      console.log(this.selectedMeeting);
     });
  }
  saveMeetingMinutes(){
    //this.db.collection("AgendaList").doc(this.selectedMeeting.documentIdOfAgendaListCollection).update({whmeetingMinutes:this.createMeetingModelObject.meetingMinutes}).then(error => console.log(error));
    
    this.route.navigate(['DetailedMeeting']);
  }
  cancelInputingMeetingMinutes(){
    this.route.navigate(['DetailedMeeting']);
  }


}
