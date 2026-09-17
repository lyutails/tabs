import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActiveContent } from './active-content';

describe('ActiveContent', () => {
  let component: ActiveContent;
  let fixture: ComponentFixture<ActiveContent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveContent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActiveContent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
