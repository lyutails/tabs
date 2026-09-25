import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  imports: [],
  selector: 'tabs-not-found',
  styleUrl: './not-found.scss',
  templateUrl: './not-found.html',
})
export class NotFound {
  protected router = inject(Router);

  navigateTabs(): void {
    this.router.navigate(['']);
  }
}
