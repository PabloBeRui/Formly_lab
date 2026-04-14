import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalExtensionsComponent } from './global-extensions.component';

describe('GlobalExtensionsComponent', () => {
  let component: GlobalExtensionsComponent;
  let fixture: ComponentFixture<GlobalExtensionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalExtensionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalExtensionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

