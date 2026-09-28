import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Found } from './found';

describe('Found', () => {
  let component: Found;
  let fixture: ComponentFixture<Found>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Found],
    }).compileComponents();

    fixture = TestBed.createComponent(Found);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
