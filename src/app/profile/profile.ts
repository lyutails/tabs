import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ProfileService } from './services/profile-service';

@Component({
  imports: [CommonModule],
  selector: 'tabs-profile',
  styleUrl: './profile.scss',
  templateUrl: './profile.html',
})
export class Profile {
  protected profileService = inject(ProfileService)

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      return;
    }

    this.profileService.selectedFile.set(file);
    this.profileService.previewUrl.set(URL.createObjectURL(file));
    this.profileService.isUploaded.set(true);
  }
}
