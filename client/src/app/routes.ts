import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { AuthGuard } from './auth/auth.guard';
import { PropertyFormModalComponent } from './shared/modals/property-form-modal/property-form-modal.component';
import { PropertyAdminComponent } from './property/components/property-admin/property-admin.component';
import { PropertyCustomerComponent } from './property/components/property-customer/property-customer.component';
import { PropertyDetailComponent } from './property/components/property-detail/property-detail.component';
import { CustomerRegisterComponent } from './user/customer-register/customer-register.component';
import { PropertyOwnerComponent } from './property/components/property-owner/property-owner.component';
import { CustomerComponent } from './customer/components/customer.component';
import { UserService } from './shared/user.service';

export const appRoutes: Routes = [
    {
        path: 'login', component: UserComponent,
        children: [{ path : '', component: SignInComponent }]
    },
    {
        path: 'register', component: UserComponent,
        children: [{ path : '', component: CustomerRegisterComponent }]
    },
    {
        path: 'admin/properties', component: PropertyAdminComponent, canActivate: [AuthGuard], data: {role: "superadmin"},
        children: [{ path : '', component: PropertyFormModalComponent }]
    },
    {
        path: 'properties/details/:type/:id', component: PropertyDetailComponent, canActivate: [AuthGuard],
    },
    {
        path: 'properties', component: PropertyCustomerComponent, canActivate: [AuthGuard], data: {role: "customer"},
        children: [{ path : '', component: PropertyFormModalComponent }]
    },
    {
        path: 'myProperties', component: PropertyOwnerComponent, canActivate: [AuthGuard], data: {role: "owner"},
    },
    {
        path: 'customers', component: CustomerComponent, canActivate: [AuthGuard], data: {role: "superadmin"},
    },
    { path: '', redirectTo: 'login', pathMatch: 'full'}

]


