import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ProfileService } from './services/profile-service';
import { ProfileInfo } from './models/profile.mode';
import { email, form, FormField, required } from '@angular/forms/signals';
import { MatError } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';

@Component({
  imports: [CommonModule, FormField, MatError, MatIcon],
  selector: 'tabs-profile',
  styleUrl: './profile.scss',
  templateUrl: './profile.html',
})
export class Profile {
  protected profileService = inject(ProfileService);
  profileModel = signal<ProfileInfo>({
    email: '',
    name: '',
  })
  profileForm = form(this.profileModel, ((schemaPath) => {
    required(schemaPath.email, { message: 'required' });
    email(schemaPath.email, { message: 'format email@email.com' });
    required(schemaPath.name, {message: 'required'});
  }));
  isEditEmail = signal<boolean>(false);
  isEditName = signal<boolean>(false);
  emailPlaceholder = 'email@email.com';
  namePlaceholder = 'Name';

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

  toggleEditEmail() {
    this.isEditEmail.set(!this.isEditEmail());
    console.log('edit')
  }

  toggleEditName() {
    this.isEditName.set(!this.isEditName());
    console.log('edit')
  }
 }
