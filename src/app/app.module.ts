import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponentComponent } from './home-component/home-component.component';
import { environment } from './../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import {DatePipe} from '@angular/common';
import { AppComponent } from './app.component';
//import below for login using microsoft
import { AngularFireAuthModule } from "@angular/fire/auth";
import {AngularFireStorageModule} from '@angular/fire/storage';
//import below for routing
import { RouterModule } from '@angular/router';
//Import below for forms working
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
//Import this below lines to use fireDb related things
import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule, AngularFireDatabase} from 'angularfire2/database'
import {AngularFirestoreModule} from '@angular/fire/firestore';
//Imported for components
import { UserListComponent } from './user-list/user-list.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
//import this for getting popup modules
//import {PopupModule} from 'ng2-opd-popup';
//import below for Table Api
import {MatTableModule} from '@angular/material/table';
//import for sorting
import {MatSortModule} from '@angular/material/sort';
//Import for angular material datepicker API
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material';
//import for multiselect
import {MatSelectModule} from '@angular/material/select';
//import {MatMomentDateModule} from '@angular/material-moment-adapter';
//import for mat-label API
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material';
//importing prime ng
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';
import {MultiSelectModule} from 'primeng/multiselect';
//import for browswe animations module
//omporting http module
import { HttpClientModule } from '@angular/common/http';
import { CreateMeetingComponent } from './create-meeting/create-meeting.component';
import { MeetingsListComponent } from './meetings-list/meetings-list.component';
import { DetailedMeetingComponent } from './detailed-meeting/detailed-meeting.component';
import { MeetingService } from './Services/meeting.service';
import { AddMeetingMinutesComponent } from './add-meeting-minutes/add-meeting-minutes.component';
import {MsalModule, MsalGuard} from '@azure/msal-angular';
import { FileService } from './Services/file.service';
import { NoaccessComponent } from './noaccess/noaccess.component';
import { AdmissionsComponent } from './admissions/admissions.component';
import { DetailedAdmissionComponent } from './detailed-admission/detailed-admission.component';
@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    NavigationBarComponent,
    HomeComponentComponent,
    CreateMeetingComponent,
    MeetingsListComponent,
    DetailedMeetingComponent,
    AddMeetingMinutesComponent,
    NoaccessComponent,
    AdmissionsComponent,
    DetailedAdmissionComponent
  ],
  imports: [
    

    BrowserModule,
    AppRoutingModule,

    //import below for popup window
    //PopupModule.forRoot(),
    //import below for working with forms
    FormsModule,
    ReactiveFormsModule,
    //Use the below lines for using firedb
    AngularFireModule.initializeApp(environment.fireBase),//Basic module. 
    /*If we want Angular fire authentication, angualr fire database 
     and all we need some other modules*/
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    //import for angular tables
    MatTableModule,
    
    //import for sorting
    MatSortModule,
    //Import for angular material datepicker
    MatDatepickerModule,
    MatNativeDateModule,
    //Import below for working with routing
    //import for mat-label API
    MatFormFieldModule,
    MatInputModule,
    //import for multiselect
    MatSelectModule,
    //import for browser animations
    BrowserAnimationsModule,
    //importing prime ng model
    OverlayPanelModule,
    ConfirmDialogModule,
    MultiSelectModule,
    AngularFireAuthModule,
    //importing http module
    HttpClientModule,
    //import for microsoft auth
    MsalModule.forRoot({
      clientID: "f1ac7d06-f07e-4a1a-96f7-428bc851cf15",
      consentScopes: ["https://graph.microsoft.com/User.ReadWrite","user.read"],
      postLogoutRedirectUri: "http://localhost:4200/"
  }),
    RouterModule.forRoot([
      {path:'',component:HomeComponentComponent,canActivate: [MsalGuard]},
      {path:'Users',component:UserListComponent,canActivate: [MsalGuard]},
      {path:'DetailedMeeting',component:DetailedMeetingComponent,canActivate: [MsalGuard]},
      {path:'MeetingsList',component:MeetingsListComponent,canActivate: [MsalGuard]},
      {path:'CreateMeeting',component:CreateMeetingComponent,canActivate: [MsalGuard]},
      {path:'Admissions',component:AdmissionsComponent,canActivate: [MsalGuard]},
      {path:'DetailedAdmission',component:DetailedAdmissionComponent,canActivate: [MsalGuard]},
      {path:'NoAccess',component:NoaccessComponent}
    ])
  ],
  providers: [MatDatepickerModule,MeetingService,ConfirmationService,FileService,DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
