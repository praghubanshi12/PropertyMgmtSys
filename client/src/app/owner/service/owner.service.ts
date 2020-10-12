import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Owner } from '../model/owner';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {

  constructor(private http: HttpClient) { }

  getAll() : Observable<Array<Owner>>{
    return this.http.get<Array<Owner>>(environment.apiBaseUrl+ "/owners");
  }
}
