import { Directive, signal } from '@angular/core';

@Directive({
  selector: '[tabsTitleHighlight]',
  host: {
    '(mouseenter)': 'isHovered.set(true)',
    '(mouseleave)': 'isHovered.set(false)',
    '[style.color]': 'isHovered() ? "red" : "var(--font-enabled-tab-color)"',
    '[style.transition]': '"all 0.3s ease-in-out"'
  }
})
export class TitleHighlight {
  protected isHovered = signal(false);
}
