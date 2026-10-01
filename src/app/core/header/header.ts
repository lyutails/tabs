import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject, OnInit, signal, viewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Theme } from '../theme-service/theme';
import { ActivatedRoute, Router } from '@angular/router';
import { Navigate } from '../services/navigate';
import { ProfileService } from '../../profile/services/profile-service';
import { BuyStore } from '../../buy/store/buy-store';
import { MatTooltip } from '@angular/material/tooltip';
import { AdvertismentService } from '../../advertisment-line/services/advertisment-service';

@Component({
  imports: [MatIconModule, CommonModule, MatTooltip],
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
  protected profileService = inject(ProfileService);
  protected buyStore = inject(BuyStore);
  isBurgerOpen = signal<boolean>(false);
  burger = viewChild<ElementRef>('burger');
  isMobile = window.matchMedia('(max-width: 768px)').matches;
  advertismentService = inject(AdvertismentService);

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth <= 768;
  }


  ngOnInit() {
    this.currentRoute = this.route.snapshot.url[0]?.path;
  }

  navigate(route: string): void {
    this.navigateService.navigate(route);
  }

  toggleBurgerMenu(): void {
    this.isBurgerOpen.set(!this.isBurgerOpen());
  }
}
