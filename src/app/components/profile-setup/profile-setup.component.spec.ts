import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSetupComponent } from './profile-setup.component';

describe('ProfileSetupComponent', () => {
  let component: ProfileSetupComponent;
  let fixture: ComponentFixture<ProfileSetupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileSetupComponent]
    });
    fixture = TestBed.createComponent(ProfileSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
