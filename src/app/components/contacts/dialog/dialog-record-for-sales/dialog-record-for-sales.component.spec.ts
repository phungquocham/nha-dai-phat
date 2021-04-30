import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DialogRecordForSalesComponent } from './dialog-record-for-sales.component';

describe('DialogRecordForSalesComponent', () => {
  let component: DialogRecordForSalesComponent;
  let fixture: ComponentFixture<DialogRecordForSalesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogRecordForSalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRecordForSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
