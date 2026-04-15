import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalValidation } from './global-validation';

describe('GlobalValidation', () => {
  let component: GlobalValidation;
  let fixture: ComponentFixture<GlobalValidation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalValidation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalValidation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
