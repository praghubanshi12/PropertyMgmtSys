import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor(private router: Router) { }

  signUpForm: FormGroup;
  loginActive: Boolean = false;
  signupActive: Boolean = false;
  
  ngOnInit(): void {
    this.loginActive = (this.router.url == "/login");
    this.signupActive = (this.router.url == "/register");
    
    this.signUpForm = new FormGroup({
      email : new FormControl(null, 
        [
          Validators.required,
          Validators.email
        ]
        )
    })
  }

}
