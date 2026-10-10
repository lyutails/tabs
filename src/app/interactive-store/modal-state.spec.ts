import { TestBed } from '@angular/core/testing';
import { ModalState } from './modal-state';

describe('ModalState', () => {
  let service: ModalState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
