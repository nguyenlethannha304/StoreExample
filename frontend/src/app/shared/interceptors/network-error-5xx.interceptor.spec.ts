import { TestBed } from '@angular/core/testing';

import { NetworkError5xxInterceptor } from './network-error-5xx.interceptor';

describe('NetworkError5xxInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      NetworkError5xxInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: NetworkError5xxInterceptor = TestBed.inject(NetworkError5xxInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
