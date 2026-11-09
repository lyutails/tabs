import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InteractiveStore } from './interactive-store';

describe('InteractiveStore', () => {
  let component: InteractiveStore;
  let fixture: ComponentFixture<InteractiveStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InteractiveStore],
    }).compileComponents();

    fixture = TestBed.createComponent(InteractiveStore);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
