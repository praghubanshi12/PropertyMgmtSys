import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UserService } from '../shared/user.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (!this.userService.isLoggedIn()) {
      this.router.navigateByUrl("/login");
      this.userService.clearLocalStorage();
      return false;
    }
    if (JSON.stringify(next.data) !== "{}") {
      let loggedInRole = this.userService.getLoggedInRole();
      if (loggedInRole.indexOf(next.data.role) == -1) {
        this.router.navigateByUrl(this.userService.getDefaultUrl());
        return false;
      }
    }


    return true;
  }

}
