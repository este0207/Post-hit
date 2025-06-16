import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LikestProduct } from './likest-product';

describe('LikestProduct', () => {
  let component: LikestProduct;
  let fixture: ComponentFixture<LikestProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LikestProduct]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LikestProduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
