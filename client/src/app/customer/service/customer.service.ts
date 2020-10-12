import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }
  
  findAllCustomers() {
    return this.http.get(environment.apiBaseUrl + "/customers");
  }

  findById(id) {
    return this.http.get(environment.apiBaseUrl + "/customers/"+ id);
  }

  findBoughtPropertiesCount(customerId){
    return this.http.get(environment.apiBaseUrl + "/customers/"+ customerId + "/properties/bought/count");
  }
}
