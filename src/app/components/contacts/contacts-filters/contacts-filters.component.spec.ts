import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContactsFiltersComponent } from './contacts-filters.component';

describe('ContactsFiltersComponent', () => {
  let component: ContactsFiltersComponent;
  let fixture: ComponentFixture<ContactsFiltersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactsFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
