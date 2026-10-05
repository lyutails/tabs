import { TestBed } from '@angular/core/testing';
import { Motion } from './motion';

describe('Motion', () => {
  let service: Motion;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Motion);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
