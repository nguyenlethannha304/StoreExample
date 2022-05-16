import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { TokenPair } from '../interface/token';

import { AuthTokenService } from './auth-token.service';
import { of } from 'rxjs';
import { NavigateService } from '../services/navigate/navigate.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
fdescribe('AuthTokenService', () => {
  let service: AuthTokenService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [NavigateService, HttpClient, HttpHandler],
    });
    service = TestBed.inject(AuthTokenService);
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('shoudl call post request', (done: DoneFn) => {
    // Preparation
    const expectedTokenPair: TokenPair = {
      access: 'a very long letter sequence',
      refresh: 'another very long sequence',
    };
    httpClientSpy.post.and.returnValue(of(expectedTokenPair));
    // Call function
    service.login('fake username', 'fake password', () => {}, '/');
    // Expect result
    debugger;
    expect(service.accessToken$).toBe(of(expectedTokenPair.access));
  });
});
