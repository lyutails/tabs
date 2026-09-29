import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Theme } from '../theme-service/theme';
import { TitleHighlight } from '../directives/title-highlight/title-highlight';
import { ActivatedRoute, Router } from '@angular/router';
import { Navigate } from '../services/navigate';

@Component({
  imports: [MatIconModule, CommonModule],
  selector: 'tabs-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
})
export class Header implements OnInit {
  themeService = inject(Theme);
  protected router = inject(Router);
  navigateService = inject(Navigate);
  route = inject(ActivatedRoute);
  protected currentRoute = '';

  ngOnInit() {
    this.currentRoute = this.route.snapshot.url[0]?.path;
  }

  navigate(route: string): void {
    this.navigateService.navigate(route);
  }
}
