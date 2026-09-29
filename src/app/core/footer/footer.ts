import { Component, inject } from '@angular/core';
import { Navigate } from '../services/navigate';
import { TitleHighlight } from '../directives/title-highlight/title-highlight';
import { ActivatedRoute } from '@angular/router';

@Component({
  imports: [TitleHighlight],
  selector: 'tabs-footer',
  styleUrl: './footer.scss',
  templateUrl: './footer.html',
})
export class Footer {
  route = inject(ActivatedRoute);
  navigateService = inject(Navigate);

  navigate(route: string): void {
    this.navigateService.navigate(route);
  }
}
