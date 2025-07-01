import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Payement } from './payement';

describe('Payement', () => {
  let component: Payement;
  let fixture: ComponentFixture<Payement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Payement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Payement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
