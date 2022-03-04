import { TestBed } from '@angular/core/testing';

import { IconRenderService } from './icon-render.service';

describe('IconRenderService', () => {
  let service: IconRenderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IconRenderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
