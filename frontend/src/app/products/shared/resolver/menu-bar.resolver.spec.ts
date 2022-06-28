import { TestBed } from '@angular/core/testing';

import { MenuBarResolver } from './menu-bar.resolver';

describe('MenuBarResolver', () => {
  let resolver: MenuBarResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(MenuBarResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
