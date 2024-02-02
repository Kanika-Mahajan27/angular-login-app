import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedinLoginComponent } from './linkedin-login.component';

describe('LinkedinLoginComponent', () => {
  let component: LinkedinLoginComponent;
  let fixture: ComponentFixture<LinkedinLoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LinkedinLoginComponent]
    });
    fixture = TestBed.createComponent(LinkedinLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
