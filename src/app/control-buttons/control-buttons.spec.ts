import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlButtons } from './control-buttons';

describe('ControlButtons', () => {
  let component: ControlButtons;
  let fixture: ComponentFixture<ControlButtons>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlButtons],
    }).compileComponents();

    fixture = TestBed.createComponent(ControlButtons);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
