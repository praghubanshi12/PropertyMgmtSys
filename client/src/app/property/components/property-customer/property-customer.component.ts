import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Owner } from 'client/src/app/owner/model/owner';
import { Status } from 'client/src/app/shared/status/model/status';
import { UserService } from 'client/src/app/shared/user.service';
import { Property } from '../../model/property';
import { PropertyService } from '../../service/property.service';

@Component({
  selector: 'app-property-customer',
  templateUrl: './property-customer.component.html',
  styleUrls: ['./property-customer.component.css']
})
export class PropertyCustomerComponent implements OnInit {

  constructor(private propertyService: PropertyService, private userService: UserService, private router: Router) { }

  properties: Array<Property>;
  customerDetails: any = null;
  interestedPropertiesIds = [];
  isStarButtonDisabled: Boolean = false;
  
  ngOnInit(): void {
    this.propertyService.getAll().subscribe(data => {
     this.customerDetails = this.userService.getLoggedInUserInfo()
      this.userService.getLoggedInUserInfo().subscribe(res => {
        this.customerDetails = res["userInfo"][0];
        let customerId = res["userInfo"][0]["_id"];
        
        var availableProperties = data.filter(property => {
          let buyerId = "";
          if(property["buyer"] != undefined){
            buyerId = property["buyer"]["_id"];
          }
          return (property["propertyStatus"]["name"] == "pending" || buyerId == customerId);
        });

        this.propertyService.getCustomerInterestedProperties(customerId).subscribe({
          next: (resp) => {
            resp["data"].forEach(customerProperty => {
              this.interestedPropertiesIds.push(customerProperty["propertyId"]);
            })
          },
          complete: () => {
            this.properties = availableProperties.map(p => {
              var property: Property = new Property;
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
              property._status = p["propertyStatus"]
              property._features = p["features"];
              property._photo = p["photo"];
              property._isCustomerInterested = false;

              if (this.interestedPropertiesIds.indexOf(p["_id"]) !== -1) {
                property._isCustomerInterested = true;
              }

              if(p["buyer"] != (undefined) ){
                if(customerId == p["buyer"]["_id"]){
                  property["status"]["name"] = "bought";
                  property["status"]["color"] = "success";
                }
              }
              return property;
            });
          }
        });
      });
    });
  }

  viewPropertyDetails(property: Property) {
    this.propertyService.setPropertyForDetails(property);
    let type = property["type"];
    let id = property["id"];
    if ((type != undefined || null) && (id != undefined || null)) {
      this.router.navigateByUrl('/properties/details/' + type + "/" + id);
    }
  }

  onInterestedIconClick(property) {
    this.isStarButtonDisabled = true;
    if(!property.isCustomerInterested){
      this.propertyService.markPropertyAsInterested(this.customerDetails, property.id).subscribe(res => {
        property.isCustomerInterested = true;
      })
    }else{
      alert("already marked as interested!!");
    }
    this.isStarButtonDisabled = false;
  }

  onLogout() {
    this.userService.clearLocalStorage();
    this.router.navigateByUrl("/login");
  }
}



