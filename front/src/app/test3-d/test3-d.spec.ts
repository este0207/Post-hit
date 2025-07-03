import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Test3D } from './test3-d';

describe('Test3D', () => {
  let component: Test3D;
  let fixture: ComponentFixture<Test3D>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Test3D]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Test3D);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
