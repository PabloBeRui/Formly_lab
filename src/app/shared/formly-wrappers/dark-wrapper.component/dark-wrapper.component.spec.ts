import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkWrapperComponent } from './dark-wrapper.component';

describe('DarkWrapperComponent', () => {
  let component: DarkWrapperComponent;
  let fixture: ComponentFixture<DarkWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DarkWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DarkWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
