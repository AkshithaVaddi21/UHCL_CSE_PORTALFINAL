import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import * as firebase from 'firebase';
import { MsalService } from '@azure/msal-angular';
import { AuthorizationServiceService } from '../Services/authorization-service.service';
@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {
  provider : firebase.auth.OAuthProvider
  user:any = null;
  userEmail:string=null;
  loggedInUserDataFromDB:any=null;
  constructor(private auth:AngularFireAuth, private authservice:MsalService, private db:AngularFirestore, private authorizationService:AuthorizationServiceService) { 
    this.authorizationService.getUserFromAuthorizationServiceObj().subscribe(data => {
      this.loggedInUserDataFromDB = data;
    });
  }

  ngOnInit() {
    
    // this.user = this.authservice.getUser();
    // this.userEmail=this.user.idToken.preferred_username;
    // console.log("nav bar",this.userEmail);
    // this.db.collection("Users").doc(this.userEmail).get().subscribe(doc=>{console.log("from DB",doc.data())})
  }
  logout(){
    this.authservice.logout();
  } 

}
