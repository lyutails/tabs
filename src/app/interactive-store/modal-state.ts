import { Service, signal } from '@angular/core';

@Service()
export class ModalState {
    isOpenModal = signal<boolean>(false);
}
