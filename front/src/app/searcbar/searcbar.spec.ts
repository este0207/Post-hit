import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Searcbar } from './searcbar';

describe('Searcbar', () => {
  let component: Searcbar;
  let fixture: ComponentFixture<Searcbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Searcbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Searcbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
