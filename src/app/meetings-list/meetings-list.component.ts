import { CreateMeetingModel } from './../Models/CreateMeetingModel';
import { Component, OnInit,ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { DetailedMeetingComponent } from '../detailed-meeting/detailed-meeting.component';
import { MeetingService } from '../Services/meeting.service';
import {MatTableDataSource} from '@angular/material/table';
//Router is for navigation between components/pages
import { Router } from '@angular/router';
import { AuthorizationServiceService } from '../Services/authorization-service.service';
import {MatSort} from '@angular/material/sort';
@Component({
  selector: 'app-meetings-list',
  templateUrl: './meetings-list.component.html',
  styleUrls: ['./meetings-list.component.css']
})
export class MeetingsListComponent implements OnInit {
meetings:MatTableDataSource<any>;
loggedInUserDataFromDB:any={};
@ViewChild(MatSort, {static: true}) sort: MatSort;
//detailedMeetingComponentObject=new DetailedMeetingComponent();
agendaList:any[];
displayedColumns: string[] = ['Subject', 'Date','Time','Duration', 'Department', 'facilitatedBy','AgendaList'];
  constructor(private db1:AngularFirestore, private meetingService:MeetingService, private route:Router, private authorizationService:AuthorizationServiceService){
    db1.collection("Meetings").valueChanges().subscribe(data=>
      {
        
        this.meetings=new MatTableDataSource(data);
        this.meetings.sort = this.sort;
    });
    this.authorizationService.getUserFromAuthorizationServiceObj().subscribe(data => {
      if(data!=null){
      this.loggedInUserDataFromDB = data;
      }
    });
   }
   getMeeting(meet){ 
    this.meetingService.setDataFromMeetingList(meet)
    this.route.navigate(['DetailedMeeting']);
    
   }
   createMeeting(){
     
     this.route.navigate(['CreateMeeting']);
   }
   applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.meetings.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {

  }

}
