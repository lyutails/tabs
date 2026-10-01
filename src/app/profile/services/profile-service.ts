import { Service, signal } from '@angular/core';

@Service()
export class ProfileService {
    isUploaded = signal<boolean>(false);
    selectedFile = signal<File | null>(null);
    previewUrl = signal<string | null>(null);
    email = signal<string>('');
    name = signal<string>('');
}
