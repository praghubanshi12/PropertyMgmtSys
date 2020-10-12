import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PropertyService } from '../../property/service/property.service';
import { CustomerService } from '../service/customer.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  constructor(private customerService: CustomerService, private propertyService: PropertyService,
    private router: Router) { }

  customers: [];

  ngOnInit(): void {
    this.customerService.findAllCustomers().subscribe(res=> {
      this.customers = res["customers"];
      res["customers"].forEach(customer => {
        this.propertyService.getCustomerInterestedProperties(customer["_id"]).subscribe(res=> {
          if(res["data"]){
            customer["interestedPropertiesCount"] = res["data"].length;
          }
        })

        this.customerService.findBoughtPropertiesCount(customer["_id"]).subscribe(res=> {
          if(res["count"] != undefined){
            customer["boughtPropertiesCount"] = res["count"];
          }
        })
      });
    })
  }

  showInterestedProperties(customerId, name){
    this.router.navigateByUrl("admin/properties?customerId="+ customerId)
  }

}
