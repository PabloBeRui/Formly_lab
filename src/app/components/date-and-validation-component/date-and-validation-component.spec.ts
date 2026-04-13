import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateAndValidationComponent } from './date-and-validation-component';

describe('DateAndValidationComponent', () => {
  let component: DateAndValidationComponent;
  let fixture: ComponentFixture<DateAndValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateAndValidationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateAndValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
