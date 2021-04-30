import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CalcTotalPourAndPushInRatingSourcesComponent } from './calc-total-pour-and-push-in-rating-sources.component';

describe('CalcTotalPourAndPushInRatingSourcesComponent', () => {
  let component: CalcTotalPourAndPushInRatingSourcesComponent;
  let fixture: ComponentFixture<CalcTotalPourAndPushInRatingSourcesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CalcTotalPourAndPushInRatingSourcesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalcTotalPourAndPushInRatingSourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
