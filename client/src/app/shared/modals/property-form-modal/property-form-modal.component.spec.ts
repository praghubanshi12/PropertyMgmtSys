import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyFormModalComponent } from './property-form-modal.component';

describe('PropertyFormModalComponent', () => {
  let component: PropertyFormModalComponent;
  let fixture: ComponentFixture<PropertyFormModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyFormModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
