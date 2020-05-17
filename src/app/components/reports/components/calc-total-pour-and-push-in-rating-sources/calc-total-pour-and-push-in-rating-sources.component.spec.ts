import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalcTotalPourAndPushInRatingSourcesComponent } from './calc-total-pour-and-push-in-rating-sources.component';

describe('CalcTotalPourAndPushInRatingSourcesComponent', () => {
  let component: CalcTotalPourAndPushInRatingSourcesComponent;
  let fixture: ComponentFixture<CalcTotalPourAndPushInRatingSourcesComponent>;

  beforeEach(async(() => {
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
