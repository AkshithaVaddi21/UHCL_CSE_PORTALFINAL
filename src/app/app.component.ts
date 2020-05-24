import { AngularFireDatabase,AngularFireObject, AngularFireList } from 'angularfire2/database';
import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";
import * as firebase from 'firebase';
import { BroadcastService, MsalService } from '@azure/msal-angular';
import { AuthorizationServiceService } from './Services/authorization-service.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  //courses:AngularFireList<any>;
  //var provider = new firebase.auth.OAuthProvider('microsoft.com');
  provider:any;
  user:any=null;
  userEmailThroughWhichHeIsLoggedIn:string=null;
  title = 'UHCL_CSE_PORTAL';
  userDetailsFromDb:any=null
  // firebase.auth().getRedirectResult()
  // .then(function(result) {
  //   // User is signed in.
  //   console.log(result.additionalUserInfo.profile)
  //   // OAuth access token can also be retrieved:
  //   // result.credential.accessToken
  //   // OAuth ID token can also be retrieved:
  //   // result.credential.idToken
  // })
  // .catch(function(error) {
  //   // Handle error.
  // });
  constructor(private auth:AngularFireAuth,private msService:BroadcastService,private authservice:MsalService, private db: AngularFirestore, private authorizationService:AuthorizationServiceService){
    //console.log(this.authservice.getUser());
    //console.log(this.authservice.getAllUsers());
    this.msService.subscribe("msal:loginSuccess", (payload) => {
      //console.log(payload);
      // do something here
      });
      this.msService.subscribe("msal:loginFailure", (payload) => {
        //console.log(payload);
        // do something here
        });
        this.msService.getMSALSubject().subscribe(data =>console.log(data));
//     this.provider = new firebase.auth.OAuthProvider('microsoft.com')
//     this.provider.addScope('profile');
// this.provider.addScope('email');
//this.auth.auth.signInWithRedirect(this.provider).then(val => console.log("redrirect val",val));

    //firebase.auth.OAuthCredential.
    //console.log(this.provider.accessToken);
    //this.auth.idTokenResult.subscribe(data => console.log(data));
    //console.log(this.auth.idTokenResult)
    //this.auth.authState.subscribe(data =>console.log("auth state",data));
    // if(this.provider.isAuthProvider==false){
    //this.auth.user.subscribe(data =>console.log(data));
    // this.auth1.auth.signInWithPopup(this.provider).then(val => console.log(val));
     //this.auth.auth.signInWithRedirect(this.provider).then(val => console.log("redrirect val",val));
    // }
    // firebase.auth().getRedirectResult().then(function(result) {
    //   if (result.credential) {
    //     // This gives you the OAuth Access Token for that provider.
    //     var token = result.credential['accessToken'];
    //     console.log(token);
    //   }
    //   var user = result.user;
    //   console.log(result);
    // });
  }
  ngOnInit(){
    
   this.getUser();
  }
  getUser(){
    this.user = this.authservice.getUser();
    this.userEmailThroughWhichHeIsLoggedIn=this.user.idToken.preferred_username;
    //console.log("app module",this.userEmailThroughWhichHeIsLoggedIn);
    this.db.collection("Users").doc(this.userEmailThroughWhichHeIsLoggedIn).get().subscribe(doc=>{this.authorizationService.setUserFromAppComponent(doc.data())});
    
  }
}
