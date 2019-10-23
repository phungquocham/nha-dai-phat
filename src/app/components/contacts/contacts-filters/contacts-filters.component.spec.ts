import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsFiltersComponent } from './contacts-filters.component';

describe('ContactsFiltersComponent', () => {
  let component: ContactsFiltersComponent;
  let fixture: ComponentFixture<ContactsFiltersComponent>;

  beforeEach(async(() => {
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
