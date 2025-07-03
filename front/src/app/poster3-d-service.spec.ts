import { TestBed } from '@angular/core/testing';

import { Poster3DService } from './poster3-d-service';

describe('Poster3DService', () => {
  let service: Poster3DService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Poster3DService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
