import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdvertismentLine } from './advertisment-line';

describe('AdvertismentLine', () => {
  let component: AdvertismentLine;
  let fixture: ComponentFixture<AdvertismentLine>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvertismentLine],
    }).compileComponents();

    fixture = TestBed.createComponent(AdvertismentLine);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
