import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { incompleteProfileGuard } from './incomplete-profile.guard';

describe('incompleteProfileGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => incompleteProfileGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
