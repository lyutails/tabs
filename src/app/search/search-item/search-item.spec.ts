import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchItem } from './search-item';

describe('SearchItem', () => {
  let component: SearchItem;
  let fixture: ComponentFixture<SearchItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchItem],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
