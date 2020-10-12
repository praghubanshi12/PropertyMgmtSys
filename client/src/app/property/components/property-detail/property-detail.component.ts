import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'jquery';
import { Property } from '../../model/property';
import { PropertyService } from '../../service/property.service';
import * as _ from 'lodash';
import { UserService } from 'client/src/app/shared/user.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.css']
})
export class PropertyDetailComponent implements OnInit {
  constructor(private propertyService: PropertyService, private userService: UserService, private route: ActivatedRoute) { }

  property: Property = null;
  propertyId: string = "";
  propertyStatus = {};
  propertyDetails: {};
  buyer: {};
  isInterested: boolean = false;
  role: string = "";
  userDetails: any;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.propertyId = params["id"];
      let type = params["type"];
      this.userService.getLoggedInUserInfo().subscribe(res => {
        if(res["userInfo"][0] != undefined){
          this.userDetails = res["userInfo"][0];
          this.propertyService.checkIfPropertyInterested(this.userDetails["_id"], this.propertyId).subscribe(res => {
            this.isInterested = res["isInterested"];
          });
        }
      });

      this.role = this.userService.getLoggedInRole();
      this.property = this.propertyService.getPropertyForDetails();
      
      //if refreshed or details url directly entered
      if (this.property == null) {
        this.propertyService.getById(this.propertyId).subscribe(p => {
          this.property = p;
          this.property["id"] = p["_id"];
          this.propertyStatus = p["propertyStatus"];
          this.buyer = p["buyer"];
        });
      }else{
        this.buyer = this.property["buyer"];
        this.propertyStatus = this.property["status"];
      }

      this.propertyService.getDetails(type, this.propertyId).subscribe(details => {
        var result = {};
        //pick details which are not empty and convert camelCase to Standard Case
        result = _.mapKeys(_.pickBy(details["details"], _.identity), (v, k) => {
          return _.startCase(k);
        });
        this.propertyDetails = result;
      });
    })
  }
  //customers
  onInterestedIconClick() {
    if(!this.isInterested){
      this.propertyService.markPropertyAsInterested(this.userDetails, this.property["id"]).subscribe(res => {
        this.isInterested = true;
      })
    }else{
      alert("already marked as interested!!");
    }
  }

}
