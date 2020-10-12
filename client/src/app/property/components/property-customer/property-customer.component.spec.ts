import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyCustomerComponent } from './property-customer.component';

describe('PropertyCustomerComponent', () => {
  let component: PropertyCustomerComponent;
  let fixture: ComponentFixture<PropertyCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
