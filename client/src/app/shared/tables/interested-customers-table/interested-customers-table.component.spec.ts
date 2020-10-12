import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestedCustomersTableComponent } from './interested-customers-table.component';

describe('InterestedCustomersTableComponent', () => {
  let component: InterestedCustomersTableComponent;
  let fixture: ComponentFixture<InterestedCustomersTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterestedCustomersTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestedCustomersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
