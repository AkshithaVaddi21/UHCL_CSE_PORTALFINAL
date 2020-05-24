import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { CreateMeetingModel } from "../Models/CreateMeetingModel";
import { AngularFirestore } from "@angular/fire/firestore";
import { MeetingService } from '../Services/meeting.service';
import {ConfirmationService} from 'primeng/api';
import { AuthorizationServiceService } from '../Services/authorization-service.service';

@Component({
  selector: "app-create-meeting",
  templateUrl: "./create-meeting.component.html",
  styleUrls: ["./create-meeting.component.css"]
})
export class CreateMeetingComponent implements OnInit {
  showCreateMeetingForm: boolean;
chairs:any[]=[];
  disableCheckBox: boolean = false;
  showAddAgendaItem: boolean;
  lblToThrowDepartmentNotSelectedError: boolean;
  createMeetingModelObject = new CreateMeetingModel();
  subagendaItemsarray:any[][] = [[]];
  subOfSubAgendaItemsArray:any[][][]=[];
  items: any[] = [
    {
      agenda: "",
      id: 1,
      subAgendaItems: [],
      duration: 0
    }
  ];

  mainAgendaItem: any = {
    agenda: "",
    id: 1,
    duration: 0,
    subAgendaItems: []
  };
  subAgendaItem: any = {
    subAgenda: "",
    subId: 1,
    subOfSubAgendaItems: []
  };
  subofSubAgendaItem: any = {
    subofSubAgenda: "",
    subOfSubId: 1
  };
  itemsArray: string[] = [];
  selectedMeeting: CreateMeetingModel;
  loggedInUserDataFromDB: any;
  //subAgendaItems: any[];
  //subOfSubAgendaItems: any[][];
  //selectedDepratmentsList:string[] = [];
  constructor(private db: AngularFirestore, private route: Router,private meetingService: MeetingService, private confirmationService: ConfirmationService,private authorizationService: AuthorizationServiceService) {
    this.createMeetingModelObject.daysForEmailAlert='2';
    this.authorizationService.getUserFromAuthorizationServiceObj().subscribe(data => {
      this.loggedInUserDataFromDB = data;
      //console.log("in nav bar",this.loggedInUserDataFromDB);
    });
    if(this.loggedInUserDataFromDB!=null){
    this.createMeetingModelObject.facilitatedBy=this.loggedInUserDataFromDB.emailId;
    //console.log(this.createMeetingModelObject.facilitatedBy);
    }
    db.collection("Users").valueChanges().subscribe(data=>
      {
        //console.log(data);
        for(let i=0; i<data.length;i++){
          if(data[i]['Role']=='Chair'){
            this.chairs.push(data[i]['emailId']);
          }
        }
      });
    this.createMeetingModelObject.inlineCheckbox1 = true;
    this.onCheck(null);
  }
  submitToSaveMeeting() {
    //date formatting
    var date = new Date(this.createMeetingModelObject.date);
    this.createMeetingModelObject.formateddate =
      date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();

    this.createMeetingModelObject.time =
      this.createMeetingModelObject.HH +
      ":" +
      this.createMeetingModelObject.MM +
      " " +
      this.createMeetingModelObject.noon;

    //duration formatting
    this.createMeetingModelObject.duration =
      this.createMeetingModelObject.duration + " Minutes";

    //department list formatting
    this.createMeetingModelObject.departmentList = this.populateSelectedDepartmentList();
    this.showCreateMeetingForm = !this.showCreateMeetingForm;

    //agenda list formatting
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].agenda != "") {
        this.itemsArray.push(this.items[i].agenda);
      }
      this.items[i].subAgendaItems = this.subagendaItemsarray[i];
    }
console.log(this.items);
    //saving to databases
    //saving to AgendaList collection
    this.db
      .collection("AgendaList")
      .add({ wholeAgendaList: this.items,saveMeetingMinutesAndSendEmail:false})
      .then(docref => {
        //storing document id of AgendaList in a variable.
        this.createMeetingModelObject.documentIdOfAgendaListCollection =
          docref.id;
          //this.db.collection("AgendaList").doc(docref.id).update({documentIdOfAgendaListCollection:docref.id});
      });
    //saving to Meetings collection
    this.db
      .collection("Meetings")
      .add({
        finalised: false,
        subject: this.createMeetingModelObject.subject,
        date: this.createMeetingModelObject.formateddate,
        time: this.createMeetingModelObject.time,
        duration: this.createMeetingModelObject.duration,
        facilitatedBy: this.createMeetingModelObject.facilitatedBy,
        department: this.createMeetingModelObject.departmentList,
        agendaList: this.itemsArray,
        approvals: [],
        rejects: [],
        files:[],
        attendees:[],
        downloadFiles:[],
        comments: [],
        daysForEmailAlert:this.createMeetingModelObject.daysForEmailAlert
      })
      .then(ref => {
        this.db.collection("AgendaList").doc(this.createMeetingModelObject.documentIdOfAgendaListCollection)
          .update({documentIdOfCurrentMeeting:ref.id, documentIdOfAgendaListCollection:this.createMeetingModelObject.documentIdOfAgendaListCollection});
        this.db
          .collection("Meetings")
          .doc(ref.id)
          .update({
            documentIdOfAgendaListCollection: this.createMeetingModelObject
              .documentIdOfAgendaListCollection,
            documentIdOfCurrentMeeting: ref.id
          });
          
      });
    
    //formatting whole form to empty
    this.createMeetingModelObject = new CreateMeetingModel();

    //routing to MeetingListComponent
    this.route.navigate(["MeetingsList"]);
  }

  cancel() {
    this.createMeetingModelObject = new CreateMeetingModel();
    this.route.navigate(["MeetingsList"]);
  }
  onCheck(event) {
    if (this.createMeetingModelObject.inlineCheckbox1) {
      this.createMeetingModelObject.inlineCheckbox2 = true;
      this.createMeetingModelObject.inlineCheckbox3 = true;
      this.createMeetingModelObject.inlineCheckbox4 = true;
      this.createMeetingModelObject.inlineCheckbox5 = true;
      this.disableCheckBox = true;
    } else {
      this.disableCheckBox = false;
      this.createMeetingModelObject.inlineCheckbox2 = false;
      this.createMeetingModelObject.inlineCheckbox3 = false;
      this.createMeetingModelObject.inlineCheckbox4 = false;
      this.createMeetingModelObject.inlineCheckbox5 = false;
    }
  }
  populateSelectedDepartmentList() {
    if (
      !this.createMeetingModelObject.inlineCheckbox1 &&
      !this.createMeetingModelObject.inlineCheckbox2 &&
      !this.createMeetingModelObject.inlineCheckbox3 &&
      !this.createMeetingModelObject.inlineCheckbox4 &&
      !this.createMeetingModelObject.inlineCheckbox5
    ) {
      this.lblToThrowDepartmentNotSelectedError = true;
    }
    var array = [];
    if (this.createMeetingModelObject.inlineCheckbox2) {
      array.push("CS");
    }
    if (this.createMeetingModelObject.inlineCheckbox3) {
      array.push("CIS");
    }
    if (this.createMeetingModelObject.inlineCheckbox4) {
      array.push("IT");
    }
    if (this.createMeetingModelObject.inlineCheckbox5) {
      array.push("DS");
    }
    return array;
  }
  newAgendaItem() {
    console.log(this.items);
    let id = this.items.length + 1;
    this.items.push({
      agenda: "",
      id: id,
      duration: null,
      meetingMinutes: "",
      subAgendaItems: ['']
    });
    this.subagendaItemsarray.push([]);
    this.subOfSubAgendaItemsArray.push([]);

  }
  cancelAgendaItemInput() {
    this.items.pop();
  }
  deleteAgendaItem(item) {
    this.confirmationService.confirm({
      message: 'Are you sure, do you want to delete this record?',
      accept: () => { 
    //console.log(item);
    const index: number = this.items.indexOf(item);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }
});
  }
  addNewSubAgendaItem(item) {
    console.log(item.id);
    if(this.subagendaItemsarray[item.id-1]!=null){
      console.log("empty array",item.id-1,this.subagendaItemsarray);
          var subItem = {
          subAgenda: "",
          subId: this.subagendaItemsarray[item.id-1].length + 1,
          meetingMinutes: "",
          subOfSubAgendaItems: []
        };
       this.subagendaItemsarray[item.id-1].push(subItem);
      
    }
    // this.items.forEach(value => {
    //   if (value.id == item.id) {
    //     var subItem = {
    //       subAgenda: "",
    //       subId: item.subAgendaItems.length + 1,
    //       subOfSubAgendaItems: []
    //     };
    //     value.subAgendaItems.push(subItem);
    //   }
    // });
  }
  deleteSubAgendaItem(item,subItem){
    this.confirmationService.confirm({
      message: 'Are you sure, do you want to delete this record?',
      accept: () => { 
    console.log(subItem);
    console.log(this.subagendaItemsarray);
    const indexOfMainAgendaItem: number = this.items.indexOf(item);
    const index=subItem.subId-1;
    console.log(index);
    //const index: number = this.subagendaItemsarray[indexOfMainAgendaItem].indexOf(subItem);
    console.log(index);
    if (index !== -1) {
      console.log("In if of delete sub")
      this.subagendaItemsarray[item.id-1].splice(index, 1);
      console.log("length:",this.subagendaItemsarray[item.id-1])
       for(let i=0;i<this.subagendaItemsarray[item.id-1].length;i++){
         this.subagendaItemsarray[item.id-1][i]['subId'] = i+1;
       }
    }
  }
});
  }
   addSubSubAgendaItem(item, subitem) {
  //   this.items.forEach(value => {
  //     if (value.id == item.id) {
  //       console.log("empty", value);
  //       value.subAgendaItems.forEach(subValue => {
  //         if (subValue.id == subitem.id) {
  //           var subofSubItem = {
  //             subofSubAgenda: "",
  //             subOfSubId: subValue.subOfSubAgendaItems.length+1
  //           };
  //           subValue.subOfSubAgendaItems.push(subofSubItem);
  //         }
  //       });
  //     }
  //   });
    console.log(subitem);
    var subofSubItem = {
                  subofSubAgenda: "",
                  subOfSubId: subitem.subOfSubAgendaItems.length+1,
                  meetingMinutes: ""
                };
                subitem.subOfSubAgendaItems.push(subofSubItem);
                console.log(this.subagendaItemsarray);

   }
   deleteSubOfSubAgendaItem(j,i,subOfSubItem){
    this.confirmationService.confirm({
      message: 'Are you sure, do you want to delete this record?',
      accept: () => { 
     console.log(subOfSubItem);
     var tempArray=this.subagendaItemsarray[j][i]['subOfSubAgendaItems'];
    
    const index: number = tempArray.indexOf(subOfSubItem);
     console.log(index);
    if (index !== -1) {
      console.log("In if of delete sub")
      tempArray.splice(index, 1);
    }
  }
});
  }
  ngOnInit() {
  //   this.meetingService.getSelectedMeetingObj().subscribe(data => {
  //     this.selectedMeeting = data;});
  //     if (this.selectedMeeting.operation=='Edit'){
  //       this.createMeetingModelObject=this.selectedMeeting;
  //       this.selectedMeeting.operation='';
  //     }
   }
}
