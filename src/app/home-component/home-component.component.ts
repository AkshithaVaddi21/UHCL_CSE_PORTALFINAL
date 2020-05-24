import { Component, OnInit } from '@angular/core';
import { AuthorizationServiceService } from '../Services/authorization-service.service';
@Component({
  selector: 'app-home-component',
  templateUrl: './home-component.component.html',
  styleUrls: ['./home-component.component.css']
})
export class HomeComponentComponent implements OnInit {
  loggedInUserDataFromDB:any=null;
  constructor(private authorizationService:AuthorizationServiceService) { 
    this.authorizationService.getUserFromAuthorizationServiceObj().subscribe(data => {
      this.loggedInUserDataFromDB = data;
    });
  }

  ngOnInit() {
  }

}
