import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthorizationServiceService {
  loggedInUser:any=null;
  loggedInUserSubject:BehaviorSubject<any>=new BehaviorSubject(null);
  constructor() { }
  setUserFromAppComponent(loggedInUser){
    this.loggedInUser=loggedInUser;
    //console.log("from Auth service",this.loggedInUser);
    this.loggedInUserSubject.next(this.loggedInUser);
  }
  getUserFromAuthorizationServiceObj(){
    return this.loggedInUserSubject.asObservable();
  }
}
