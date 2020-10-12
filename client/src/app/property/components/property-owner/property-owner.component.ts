import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Owner } from 'client/src/app/owner/model/owner';
import { Property } from 'client/src/app/property/model/property';
import { UserService } from 'client/src/app/shared/user.service';
import { PropertyService } from '../../service/property.service';

@Component({
  selector: 'app-property-owner',
  templateUrl: './property-owner.component.html',
  styleUrls: ['./property-owner.component.css']
})
export class PropertyOwnerComponent implements OnInit {

  constructor(private userService: UserService, private propertyService: PropertyService,
    private router: Router,
    private modal: NgbModal) { }

  myProperties: Array<any> = null;
  ownerDetails: any = null;
  ownerId = "";
  buyer = {};
  propertyId: string = "";
  propertyStatus: {};
  interestedPropertyType: string = "";
  interestedPropertyLocation: string = "";
  customersModalRef: NgbModalRef

  ngOnInit(): void {

    this.userService.getLoggedInUserInfo().subscribe({
      next: (res) => {
        this.ownerDetails = res["userInfo"][0];
        this.ownerId = this.ownerDetails["_id"];
      },
      complete: () => {
        this.propertyService.getPropertiesOfOwner(this.ownerDetails["_id"]).subscribe(resp => {
          this.myProperties = resp["properties"].map(p => {
            var property: Property = new Property;
            this.propertyService.getInterestedCustomers(p["_id"]).subscribe(res => {
              property._id = p["_id"];
              property._area = p["area"];
              property._location = p["location"];
              property._road = p["road"];
              property._type = p["type"];
              property._price = p["price"];
              property._owner = new Owner;
              property._owner["id"] = p["owner"]["_id"];
              property._owner["fullName"] = p["owner"]["name"];
              property._owner["contactNo"] = p["owner"]["contactNo"];
              property._owner["email"] = p["owner"]["email"];
              property._status = p["propertyStatus"];
              property._photo = p["photo"];
              property._interestedCustomersCount = res["customers"].length;
              property._buyer = p["buyer"];
            });
            if (property != null) {
              return property;
            }
          });
        });
      }
    });
  }

  viewPropertyDetails(property) {
    this.router.navigateByUrl("/properties/details/" + property.type + "/" + property.id)
  }

  onInterestedCustomersBtnClick(property, content) {
    this.propertyId = property.id;
    this.buyer = {};
    if(property.buyer !== undefined){
      this.buyer = property.buyer;
    }
    this.propertyStatus = property.status;
    this.interestedPropertyType = property.type;
    this.interestedPropertyLocation = property.location;
    this.customersModalRef = this.modal.open(content, { size: 'lg' });
  }

  onLogout() {
    this.userService.clearLocalStorage();
    this.router.navigateByUrl("/login");
  }

}
