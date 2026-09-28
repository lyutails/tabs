import { TestBed } from '@angular/core/testing';
import { BuyStore } from './buy-store';

describe('BuyStore', () => {
  let service: BuyStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuyStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
