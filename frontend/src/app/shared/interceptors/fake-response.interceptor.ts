// import { Injectable } from '@angular/core';
// import {
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpInterceptor,
//   HttpResponse,
// } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import {
//   provinces,
//   profile,
//   productList,
//   productList2,
// } from 'src/app/data-for-test';
// import { environment as e } from 'src/environments/environment';
// import { of } from 'rxjs';
// @Injectable()
// export class FakeResponseInterceptor implements HttpInterceptor {
//   constructor() {}

//   intercept(
//     request: HttpRequest<unknown>,
//     next: HttpHandler
//   ): Observable<HttpEvent<unknown>> {
//     if (!e.production) {
//       if (request.url.includes(`${e.api}/users/get_provinces_cities/`)) {
//         return of(new HttpResponse({ status: 200, body: provinces }));
//       }
//       if (request.url.includes(`${e.api}/users/profile/`)) {
//         return of(new HttpResponse({ status: 200, body: profile }));
//       }
//       if (
//         request.url.includes(`${e.api}/products/t`) ||
//         request.url.includes(`${e.api}/products/c`)
//       ) {
//         if (request.url.includes('?page=2')) {
//           return of(new HttpResponse({ status: 200, body: productList2 }));
//         }
//         return of(new HttpResponse({ status: 200, body: productList }));
//       }
//     }
//     return next.handle(request);
//   }
// }
