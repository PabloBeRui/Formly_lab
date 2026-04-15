import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsyncDataComponent } from './async-data.component';

describe('AsyncDataComponent', () => {
  let component: AsyncDataComponent;
  let fixture: ComponentFixture<AsyncDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsyncDataComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AsyncDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
