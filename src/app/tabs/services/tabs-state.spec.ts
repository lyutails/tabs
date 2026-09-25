import { TestBed } from '@angular/core/testing';
import { TabsState } from './tabs-state';

describe('TabsState', () => {
  let service: TabsState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TabsState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
