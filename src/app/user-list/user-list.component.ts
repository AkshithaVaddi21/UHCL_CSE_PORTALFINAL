//import { PopupModule } from 'ng2-opd-popup';
import { User } from './../Models/User';
import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {ConfirmationService} from 'primeng/api';
import { AuthorizationServiceService } from '../Services/authorization-service.service';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users:MatTableDataSource<any>;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  roles=['Admin','Faculty','Chair','Admission','Waiver'];
  departments=['CS','CIS','IT','DS'];
  showAddUserForm:boolean;
  showUpdateUserForm:Boolean;
  editClicked:boolean=false;
  title = 'myFirstDemoForFireDB';
  usersEmailIdsForValidation:string[]=[];
  tempUser:any = {};
  // dataq:any[] = [
  //   {firstName:'hi',lastName:'ji',Role:'tt',emailId:'re',department:'ee'}
  //   ,{firstName:'ri',lastName:'wi',Role:'qt',emailId:'ae',department:'ae'}
  // ]
  //Below is for database coulmn names
  displayedColumns: string[] = ['Action','firstName', 'lastName', 'Role', 'emailId','department'];
  addUserObject=new User();
  loggedInUserDataFromDB: any= {};
  constructor (private db:AngularFirestore,private confirmationService: ConfirmationService,private authorizationService: AuthorizationServiceService){
    //this.users = new MatTableDataSource(this.dataq);
    //this.users.sort = this.sort;
    this.authorizationService.getUserFromAuthorizationServiceObj().subscribe(data => {
      if(data!=null){
      this.loggedInUserDataFromDB = data;
      }
      //console.log("in nav bar",this.loggedInUserDataFromDB);
    });
    db.collection("Users").valueChanges().subscribe(data=>
      {
        console.log(data);
        this.users=new MatTableDataSource(data);
        this.users.sort = this.sort;
        for(let i=0;i<data.length;i++){
          this.usersEmailIdsForValidation.push(data[i]['emailId'])
        }
        
    });
  
  }
  
  addUser(){
    this.showAddUserForm=true;
  }
  submitToSaveUser(){
  this.showAddUserForm=!this.showAddUserForm;
  console.log("hc",this.addUserObject.admissionApplicationReviewer);
 this.db.collection("Users").doc(this.addUserObject.email).set({firstName:this.addUserObject.firstName,lastName:this.addUserObject.lastName,emailId:this.addUserObject.email,department:this.addUserObject.department,Role:this.addUserObject.role,admissionApplicationReviewer:this.addUserObject.admissionApplicationReviewer}).then(error => console.log(error));
 
 if(this.editClicked==true){
 if(this.tempUser.emailId!=this.addUserObject.email){
   this.deleteUser(this.tempUser)
   this.tempUser={};
 }
 this.editClicked=false;
 }
 this.addUserObject=new User(); 
}
  editButtonClicked(presentUser){
    this.editClicked=true;
    this.tempUser=presentUser;
    this.addUserObject.department=presentUser.department;
    this.addUserObject.role=presentUser.Role;
    this.addUserObject.email=presentUser.emailId;
    this.addUserObject.firstName=presentUser.firstName;
    this.addUserObject.lastName=presentUser.lastName;
    this.addUserObject.admissionApplicationReviewer=presentUser.admissionApplicationReviewer;
    this.showAddUserForm=true;
  }
  /*updateButtonClicked(){
    this.showAddUserForm=!this.showAddUserForm;
    this.db.collection("Users").doc(this.addUserObject.email).set({firstName:this.addUserObject.firstName,lastName:this.addUserObject.lastName,emailId:this.addUserObject.email,department:this.addUserObject.department,Role:this.addUserObject.role}).then(error => console.log(error));
  
  }*/
  deleteUser(presentUser){
    this.confirmationService.confirm({
      message: 'Are you sure, do you want to delete this record?',
      header:presentUser.firstName+" "+presentUser.lastName,
      accept: () => {
this.db.collection("Users").doc(presentUser.emailId).delete()
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
  cancel(){
    this.showAddUserForm=!this.showAddUserForm;
    this.editClicked=false;
    this.addUserObject=new User(); 

  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.users.filter = filterValue.trim().toLowerCase();
  }
  ngOnInit() {
    
  }
}
