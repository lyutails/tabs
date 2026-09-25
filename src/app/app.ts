import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Header } from './core/header/header';
import { Theme } from './core/theme-service/theme';
import { Footer } from './core/footer/footer';

@Component({
  selector: 'tabs-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  host: {
    '[class.dark]': "themeService.theme() === 'dark'"
  },
})
export class App implements OnInit {
  themeService = inject(Theme);
  
  ngOnInit(): void {
    document.fonts?.load('24px "Material Icons"').then(() => {
      document.body.classList.add('material-icons-loaded');
    });
    document.fonts?.load('24px "Material Symbols Outlined"').then(() => {
      document.body.classList.add('material-symbols-loaded');
    });
  }
}

