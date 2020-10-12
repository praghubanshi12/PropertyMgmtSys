import { Injectable } from '@angular/core';
import { User } from './user';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  selectedUser: User = {
    email: '',
    password: ''
  };
  loggedInRole = "";
  defaultUrl = "";
  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) }

  constructor(public http: HttpClient) { }

  postCustomerUser(customer) {
    return this.http.post(environment.apiBaseUrl + "/users/customers/register", customer, this.noAuthHeader);
  }

  login(authCredentials) {
    return this.http.post(environment.apiBaseUrl + "/users/authenticate", authCredentials, this.noAuthHeader);
  }

  getLoggedInUserInfo() {
    return this.http.get(environment.apiBaseUrl + "/users/loggedInUser/info/" + this.getLoggedInRole())
  }

  setToken(token: string) {
    localStorage.setItem("token", token);
  }

  getToken() {
    return localStorage.getItem("token");
  }

  clearLocalStorage() {
    localStorage.clear();
  }

  getUserPayload() {
    if (this.getToken()) {
      var userPayload = atob(this.getToken().split('.')[1]);
      return JSON.parse(userPayload);
    }
    return null;
  }

  isLoggedIn() {
    var userPayLoad = this.getUserPayload();
    if (userPayLoad) {
      return userPayLoad.exp > Date.now() / 1000;
    }
    return false;
  }

  setLoggedInRole(role) {
    localStorage.setItem("loggedInRole", role);
  }

  getLoggedInRole() {
    return localStorage.getItem("loggedInRole");
  }

  setDefaultUrl(url) {
    localStorage.setItem("defaultUrl", url);
  }

  getDefaultUrl() {
    return localStorage.getItem("defaultUrl");
  }

}
