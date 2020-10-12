import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Property } from '../model/property';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  constructor(public http: HttpClient) { }

  selectedProperty: Property = null;

  getAll(): Observable<Array<Property>> {
    return this.http.get<Array<Property>>(environment.apiBaseUrl + "/properties");
  }

  getInIdList(ids) {
    return this.http.get<Property>(environment.apiBaseUrl + "/properties/array?ids=" + ids);
  }

  getById(id) {
    return this.http.get<Property>(environment.apiBaseUrl + "/properties/" + id);
  }

  getDetails(type, id) {
    return this.http.get(environment.apiBaseUrl + "/properties/details/type/" + type + "/" + id);
  }

  getCustomerInterestedProperties(customerId) {
    return this.http.get(environment.apiBaseUrl + "/customers/" + customerId + "/properties/interested");
  }

  checkIfPropertyInterested(customerId, propertyId) {
    return this.http.get(environment.apiBaseUrl + "/customers/" + customerId + "/properties/interested/" + propertyId);
  }

  setPropertyForDetails(property: Property) {
    this.selectedProperty = property;
  }

  getPropertyForDetails() {
    return this.selectedProperty;
  }

  getPropertiesOfOwner(ownerId) {
    return this.http.get(environment.apiBaseUrl + "/owners/properties/" + ownerId);
  }

  getInterestedCustomers(propertyId) {
    return this.http.get(environment.apiBaseUrl + "/properties/interestedCustomers/" + propertyId);
  }

  save(property: Property) {
    var formData: any = new FormData();
    formData.append("type", property["type"]);
    formData.append("location", property["location"]);
    formData.append("area", property["area"]);
    property["features"].forEach(feature=> {
      if(feature!= ""){
        formData.append("features", feature);
      }
    })
    
    formData.append("ownerId", property["ownerId"]);
    formData.append("price", property["price"]);
    formData.append("road", property["road"]);
    if (property["type"] == "house") {
      formData.append("houseDetails[noOfBedroom]", property["houseDetails"]["noOfBedroom"]);
      formData.append("houseDetails[noOfBathroom]", property["houseDetails"]["noOfBathroom"]);
      formData.append("houseDetails[noOfKitchen]", property["houseDetails"]["noOfKitchen"]);
    }

    if (property["type"] == "land") {
      formData.append("landDetails[facing]", property["landDetails"]["facing"]);
    }
    formData.append("status[name]", property["status"]["name"]);
    formData.append("status[color]", property["status"]["color"]);
    formData.append("photo", property["photo"]);
    return this.http.post(environment.apiBaseUrl + "/properties/save", formData);
  }

  saveOwner(owner) {
    return this.http.post(environment.apiBaseUrl + "/owners/save", owner);
  }

  markPropertyAsInterested(customer, propertyId) {
    return this.http.post(environment.apiBaseUrl + "/customers/properties/save/" + propertyId, customer);
  }

  verify(propertyId) {
    return this.http.post(environment.apiBaseUrl + "/properties/verify/" + propertyId, null);
  }

  sellProperty(propertyId, customer) {
    return this.http.post(environment.apiBaseUrl + "/properties/sell/" + propertyId, customer);
  }
}
