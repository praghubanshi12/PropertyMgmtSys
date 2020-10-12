import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Owner } from 'client/src/app/owner/model/owner';
import { OwnerService } from 'client/src/app/owner/service/owner.service';
import { PropertyService } from 'client/src/app/property/service/property.service';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-property-form-modal',
  templateUrl: './property-form-modal.component.html',
  styleUrls: ['./property-form-modal.component.css']
})
export class PropertyFormModalComponent implements OnInit {

  constructor(private ownerService: OwnerService, private propertyService: PropertyService, private userService: UserService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) { }

  ownerForm: FormGroup;
  propertyForm: FormGroup;
  owners: Array<Owner> = [];
  propertyModalReferenece: NgbModalRef;
  ownerFormModalReferenece: NgbModalRef;
  defaultSelectedOwnerId: string = '';
  role: string = "";
  preview: string = "";

  ngOnInit(): void {
    this.role = this.userService.getLoggedInRole();

    if (this.role != "") {
      if (this.role == "superadmin") {
        this.ownerService.getAll().subscribe(data => {
          if (data.length > 0) {
            this.owners = data.map(o => {
              var owner: Owner = new Owner();
              owner._id = o["_id"];
              owner._fullName = o["name"];
              owner._email = o["email"];
              owner._contactNo = o["contactNo"];
              return owner;
            });
            this.defaultSelectedOwnerId = this.owners[0]["id"];
          }

          this.buildPropertyForm();
          this.setDetailsValidators();
        });

        this.ownerForm = this.formBuilder.group({
          "name": ['', Validators.required],
          "email": ['', Validators.required],
          "contactNo": ['', Validators.required]
        });
      }
      else if (this.role == "owner") {
        this.userService.getLoggedInUserInfo().subscribe(res => {
          this.defaultSelectedOwnerId = res["userInfo"][0]["_id"];
          var ownerDto: Array<Owner>;
          ownerDto = res["userInfo"].map(o => {
            var owner: Owner = new Owner();
            owner._id = o["_id"];
            owner._fullName = o["name"];
            owner._email = o["email"];
            owner._contactNo = o["contactNo"];
            return owner;
          })

          this.owners.push(ownerDto[0]);
          this.buildPropertyForm();
          this.setDetailsValidators();
        })

      }
    }
  }

  buildPropertyForm() {
    this.propertyForm = this.formBuilder.group(
      {
        'area': ['',
          Validators.required,
        ],
        'location': ['',
          Validators.required,
        ],
        'road': ['',
          Validators.required,
        ],
        'type': ['land',
          Validators.required,
        ],
        'price': ['',
          Validators.required
        ],
        'unit': ['',
          Validators.required
        ],
        'ownerId': [this.defaultSelectedOwnerId,
        Validators.required,
        ],
        'houseDetails': this.formBuilder.group({
          'noOfBedroom': [0, Validators.required],
          'noOfKitchen': [0, Validators.required],
          'noOfBathroom': [0, Validators.required],
        }),
        'landDetails': this.formBuilder.group({
          'facing': ['', Validators.required],
        }),
        'features': this.formBuilder.array([]),
        'status': [''],
        'photo': [null, Validators.required]
      }
    )

    switch (this.propertyForm.get("type").value) {
      case 'land':
        this.disableHouseDetails();
        break;

      case 'house':
        this.disableLandDetails();
        break;

      default:
        break;
    }
  }

  setDetailsValidators() {
    this.propertyForm.get("type").valueChanges.subscribe(type => {
      this.propertyForm.patchValue({
        area: '',
        location: '',
        road: '',
        price: '',
        unit: ''
      })
      this.getFeatures().clear();

      if (type == "house") {
        this.disableLandDetails();
      }
      if (type == "land") {
        this.disableHouseDetails();
      }
    });
  }

  disableLandDetails() {
    // this.propertyForm.get('landDetails.price').setValidators(null);
    // this.propertyForm.get('landDetails.price').updateValueAndValidity({emitEvent:false});
    this.propertyForm.get('unit').disable();
    this.propertyForm.get('houseDetails').enable();
    this.propertyForm.get('landDetails').disable();
  }

  disableHouseDetails() {
    this.propertyForm.get('unit').enable();
    this.propertyForm.get('landDetails').enable();
    this.propertyForm.get('houseDetails').disable();
  }

  //dynamically add feature and remove start
  getFeatures() {
    return this.propertyForm.get('features') as FormArray
  }

  newFeature() {
    return this.formBuilder.group({
      "feature": ''
    })
  }

  addFeature() {
    this.getFeatures().push(this.newFeature());
  }

  removeFeature(i) {
    this.getFeatures().removeAt(i);
  }
  //dynamically add feature and remove start

  savePropertyForm(form) {
    let status = {};
    if (this.role == "superadmin") {
      status = {
        name: "pending",
        color: "warning"
      }
    }

    else if (this.role == "owner") {
      status = {
        name: "unverified",
        color: "danger"
      }
    }
    form.value.status = status;

    var displayPrice =
      "Rs. " + form.value.price + (form.value.type == 'land' ? (' (per ' + form.value.unit) + ')' : '');

    form.value.price = displayPrice;

    var featuresArray = [];
    form.value.features.forEach(featureObj => {
      featuresArray.push(featureObj["feature"])
    });

    form.value.features = featuresArray;

    this.propertyService.save(form.value).subscribe(
      res => {
        if (res["status"] == 200) {
          this.propertyModalReferenece.close();
          alert("Property created successfully")
          window.location.reload();
        }else if(res["status"] == 500){
          alert(res["message"]);
        }
      });
  }

  saveOwnerForm(form) {
    this.propertyService.saveOwner(form.value).subscribe(res => {
      let ownerId = res["owner"]["_id"];
      var owner: Owner = new Owner();
      owner._id = ownerId;
      owner._fullName = res["owner"]["name"];
      owner._email = res["owner"]["email"];
      owner._contactNo = res["owner"]["contactNo"];
      this.owners.push(owner);
      this.propertyForm.get('ownerId').setValue(ownerId);
      this.propertyForm.get('ownerId').updateValueAndValidity({ emitEvent: false, onlySelf: true })
      this.defaultSelectedOwnerId = owner._id;
      this.ownerFormModalReferenece.close();
    })
  }

  onOwnerAddBtnClick(content) {
    this.ownerFormModalReferenece = this.modalService.open(content);
  }

  onPropertyAddBtnClick(content) {
    this.propertyModalReferenece = this.modalService.open(content);
  }

  uploadFile(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.propertyForm.patchValue({
      photo: file
    });
    this.propertyForm.get("photo").updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.preview = reader.result as string;
    }
    reader.readAsDataURL(file);
  }

}
