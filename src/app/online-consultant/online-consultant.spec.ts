import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnlineConsultant } from './online-consultant';

describe('OnlineConsultant', () => {
  let component: OnlineConsultant;
  let fixture: ComponentFixture<OnlineConsultant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnlineConsultant],
    }).compileComponents();

    fixture = TestBed.createComponent(OnlineConsultant);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
