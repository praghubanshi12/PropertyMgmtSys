import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PropertyService } from 'client/src/app/property/service/property.service';

@Component({
  selector: 'app-interested-customers-table',
  templateUrl: './interested-customers-table.component.html',
  styleUrls: ['./interested-customers-table.component.css']
})
export class InterestedCustomersTableComponent implements OnInit {

  constructor(private propertyService: PropertyService,) { }

  interestedCustomers: [];
  @Input() propertyId: string;
  @Input() propertyStatus: string;
  @Input() modalRef: NgbModalRef;
  @Input() buyer: {} = {};

  ngOnInit(): void {
    this.propertyService.getInterestedCustomers(this.propertyId).subscribe(res => {
      this.interestedCustomers = res["customers"];
    });
  }
  
  sellProperty(customer) {
    this.propertyService.sellProperty(this.propertyId, customer).subscribe(res => {
      if(res["property"]){
        let property = res["property"];
        
        //this 2 way child parent binding works only for key value pairs @input..
        //for string @input 2 way binding, use @output, eventEmitter
        this.buyer = {};
        this.propertyStatus["name"] = property["propertyStatus"]["name"];
        this.propertyStatus["color"] = property["propertyStatus"]["color"];
        this.buyer["_id"] = property["buyer"]["_id"];
        this.buyer["name"] = property["buyer"]["name"];
        this.buyer["contactNo"] = property["buyer"]["contactNo"];
        this.buyer["email"] = property["buyer"]["contactNo"];
        this.buyer["address"] = property["buyer"]["address"];
        // if (this.modalRef != undefined) {
        //   this.modalRef.close();
        // }
        alert("$old to " + property["buyer"]["name"] + "!!!!!");
      }else{
        alert("need to handle this error!!");
      }
    })
  }

}
