import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'client/src/app/shared/user.service';
import { PropertyService } from '../../service/property.service';
import { Property } from './../../model/property';
import { FormGroup } from '@angular/forms';
import { Owner } from 'client/src/app/owner/model/owner';
import * as _ from 'lodash';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Status } from 'client/src/app/shared/status/model/status';
import { CustomerService } from 'client/src/app/customer/service/customer.service';

@Component({
  selector: 'app-property-admin',
  templateUrl: './property-admin.component.html',
  styleUrls: ['./property-admin.component.css']
})
export class PropertyAdminComponent implements OnInit {

  constructor(
    private userService: UserService, private propertyService: PropertyService, private customerService: CustomerService,
    private router: Router,
    private modal: NgbModal,
    private activatedRoute: ActivatedRoute) { }

  properties: Array<Property> = null;
  propertyId: string = "";
  propertyStatus = {};
  interestedPropertyType = "";
  interestedPropertyLocation = "";
  boughtPropertyType = "";
  boughtPropertyLocation = "";
  propertyForm: FormGroup;
  dtOptions: DataTables.Settings = {};
  propertyFeatures = [];
  propertyDetails = {};
  customersModalRef: NgbModalRef;
  buyer = {};
  interestedPropertyIds = [];
  customerName = "";

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      let customerId = params["customerId"];
      //if properties related to customer START
      if (customerId != undefined) {
        this.customerService.findById(customerId).subscribe(res => {
          if (res["customer"]) {
            this.customerName = res["customer"]["name"];
          }
        })
        //show only interested properties of customer..
        this.propertyService.getCustomerInterestedProperties(customerId).subscribe(res => {
          if (res["data"]) {
            res["data"].forEach(element => {
              this.interestedPropertyIds.push(element.propertyId);
            });

            if(this.interestedPropertyIds.length>0){
              this.propertyService.getInIdList(this.interestedPropertyIds).subscribe(data => {
                this.mapProperties(data, customerId);
                this.mapInterestedCustomersOnProperties();
              });
            }else{
              this.properties = [];
            }            
          }
        })
      } 
      //if properties related to customer END
      else {
        this.propertyService.getAll().subscribe(data => {
          this.mapProperties(data, "");
          this.mapInterestedCustomersOnProperties();
        });
      }
    })

    this.dtOptions = {
      pagingType: 'full_numbers',
      processing: true,
      order: [6, 'desc']
    }
  }

  //helper functions START
  mapProperties(data, customerId) {
    this.properties = data.map(p => {
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
      property._status = p["propertyStatus"];
      property._features = p["features"];
      property._photo = p["photo"];
      property._buyer = {};
      if (p["propertyStatus"]["name"] == "sold") {
        if (customerId == p["buyer"]["_id"] && customerId != "") {
          var propertyStatus: Status = new Status;
          propertyStatus._name = "bought";
          propertyStatus._color = "success";
          property._status = propertyStatus
        }
        property._buyer = p["buyer"];
      }
      if (property != null) {
        return property;
      }
    });
  }

  mapInterestedCustomersOnProperties(){
    this.properties.forEach(p => {
      this.propertyService.getInterestedCustomers(p["id"]).subscribe(res => {
        p._interestedCustomersCount = res["customers"].length;
      });
    })
  }
  //helper functions END

  onPropertyDetailsBtnClick(propertyId, type,property) {
    this.propertyService.setPropertyForDetails(property);
    this.router.navigateByUrl("/properties/details/" + type + "/" + propertyId);
  }

  onInterestedCustomersBtnClick(property, content) {
    this.propertyId = property.id;
    this.propertyStatus = property.status;
    this.buyer = property.buyer;
    this.interestedPropertyType = property.type;
    this.interestedPropertyLocation = property.location;
    this.customersModalRef = this.modal.open(content, { size: 'lg' });
  }

  verifyProperty(property) {
    let propertyId = property.id;
    this.propertyService.verify(propertyId).subscribe(res => {
      if (res) {
        property._status = { name: "pending", color: "warning" };
      }
    });
  }

  showBuyerDetails(property, content) {
    this.modal.open(content);
    this.buyer = property.buyer;
    this.boughtPropertyType = property.type;
    this.boughtPropertyLocation = property.location;
  }

  onLogout() {
    this.userService.clearLocalStorage();
    this.router.navigateByUrl("/login");
  }
}
