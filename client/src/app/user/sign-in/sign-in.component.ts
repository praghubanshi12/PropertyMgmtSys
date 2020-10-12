import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../shared/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) { }

  signUpForm: FormGroup;
  serverErrorMessages: string;
  defaultUrl: string = "";
  userRole: string = "";
  multipleRoles: [];
  private token: "";

  ngOnInit(): void {
    if (this.userService.isLoggedIn()) {
      this.router.navigateByUrl(this.userService.getDefaultUrl());
    }

    this.signUpForm = this.formBuilder.group({
      email: ['',
        [
          Validators.required
        ]
      ],
      password: ['',
        [
          Validators.required,
          Validators.minLength(4)
        ]
      ]
    })
  }

  onSubmit(form: FormGroup, role: string) {
    this.userService.login(form.value).subscribe(
      res => {
        if (role == "singleRole") {
          this.userRole = res["currentRole"];
          if (res["multipleRoles"].length > 1) {
            this.multipleRoles = res["multipleRoles"];
          } else {
            this.token = res["token"];
            this.navigateToUrl();
          }
        } else {
          this.userRole = role;
          this.token = res["token"];
          this.navigateToUrl();
        }
      },
      err => {
        this.serverErrorMessages = err.error.message;
      }
    );
  }
  
  navigateToUrl() {
    switch (this.userRole) {
      case "customer":
        this.defaultUrl = "/properties";
        break;

      case "owner":
        this.defaultUrl = "/myProperties";
        break;

      case "superadmin":
        this.defaultUrl = "/admin/properties";
        break;

      case "multiple":
        this.defaultUrl = "none";
        break;

      default:
        break;
    }

    if (this.defaultUrl != "none") {
      this.userService.setToken(this.token);
      this.userService.setDefaultUrl(this.defaultUrl);
      this.userService.setLoggedInRole(this.userRole);
      this.router.navigateByUrl(this.defaultUrl);
    }
  }
}


