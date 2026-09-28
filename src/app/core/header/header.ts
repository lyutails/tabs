import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Theme } from '../theme-service/theme';
import { TitleHighlight } from '../directives/title-highlight/title-highlight';
import { Router } from '@angular/router';
import { Navigate } from '../services/navigate';

@Component({
  imports: [MatIconModule, CommonModule, TitleHighlight],
  selector: 'tabs-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
})
export class Header {
  themeService = inject(Theme);
  protected router = inject(Router);
  navigateService = inject(Navigate);

  navigate(route: string): void {
    this.navigateService.navigate(route);
  }
}
