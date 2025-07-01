import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CGV } from './cgv';

describe('CGV', () => {
  let component: CGV;
  let fixture: ComponentFixture<CGV>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CGV]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CGV);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
