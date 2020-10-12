//built-in
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//components
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { PropertyFormModalComponent } from './shared/modals/property-form-modal/property-form-modal.component';
import { PropertyAdminComponent } from './property/components/property-admin/property-admin.component';
import { PropertyCustomerComponent } from './property/components/property-customer/property-customer.component';

//routes
import { appRoutes } from './routes';
import { SignInComponent } from './user/sign-in/sign-in.component';

//services
import { UserService } from './shared/user.service';
import { PropertyService } from './property/service/property.service';
import { OwnerService } from './owner/service/owner.service';
import { CustomerService } from './customer/service/customer.service';

//auth
import { AuthGuard } from './auth/auth.guard';
import { AuthInterceptor } from './auth/auth.interceptor';
import { PropertyDetailComponent } from './property/components/property-detail/property-detail.component';
import { CustomerRegisterComponent } from './user/customer-register/customer-register.component';
import { PropertyOwnerComponent } from './property/components/property-owner/property-owner.component';
import { InterestedCustomersTableComponent } from './shared/tables/interested-customers-table/interested-customers-table.component';
import { CustomerComponent } from './customer/components/customer.component';
import { HeaderComponent } from './shared/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    SignInComponent,
    PropertyAdminComponent,
    PropertyFormModalComponent,
    PropertyCustomerComponent,
    PropertyDetailComponent,
    CustomerRegisterComponent,
    PropertyOwnerComponent,
    InterestedCustomersTableComponent,
    CustomerComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    DataTablesModule,
    NgbModule
  ],
  providers: [UserService, PropertyService, OwnerService, CustomerService, AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
