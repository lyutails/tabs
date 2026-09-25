import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Theme } from '../theme-service/theme';

@Component({
  imports: [MatIconModule, CommonModule],
  selector: 'tabs-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
})
export class Header {
  themeService = inject(Theme);
}
