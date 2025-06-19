import { TestBed } from '@angular/core/testing';

import { DisplayProductService } from './display-product-service';

describe('DisplayProductService', () => {
  let service: DisplayProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisplayProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
