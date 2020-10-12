import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../shared/user.service';

@Component({
  selector: 'app-customer-register',
  templateUrl: './customer-register.component.html',
  styleUrls: ['./customer-register.component.css']
})
export class CustomerRegisterComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router) { }

  registerForm: FormGroup;
  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      'firstName': ['', Validators.required],
      'lastName': ['', Validators.required],
      'email': ['',
        [
          Validators.required,
          Validators.email
        ]
      ],
      'password': ['', [
        Validators.required,
        Validators.minLength(4)
      ]
      ],
      'address': ['', Validators.required],
      'contactNo': ['', Validators.required],
    })
  }

  onSubmit(form) {
    this.userService.postCustomerUser(form.value).subscribe(res=>{
      if(res["customer"] != null || undefined){
        alert("Customer saved successfully!!");
        this.router.navigateByUrl("/login");
      }else{
        alert("Internal Server error");
      }
    });
  }

}
