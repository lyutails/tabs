import { Component, ElementRef, input, model, ViewChild, viewChild } from '@angular/core';

@Component({
  imports: [],
  selector: 'tabs-tab',
  styleUrl: './tab.scss',
  templateUrl: './tab.html',
  host: {
    '[class.tab_background-color]': 'sizeTitle() % 10 === 0',
  }
})
export class Tab {
  label = input.required<string>();
  disabled = input(false);
  title = model.required<string>();
  active = input<boolean>(false);
  sizeTitle = model(20);
  @ViewChild('tab') tabDecoratorView!: ElementRef<HTMLDivElement>;
  tabSignalView = viewChild<ElementRef<HTMLDivElement>>('tab');

  ngAfterViewInit() {
    const tabDec = this.tabDecoratorView?.nativeElement;
    tabDec.animate(
      [
        {
          transform: 'translateY(0)',
          opacity: 1,
        },
        {
          transform: 'translateY(20px)',
          opacity: 0,
        },
        {
          transform: 'translateY(0)',
          opacity: 1,
        },
      ],
      {
        duration: 1000,
        easing: 'cubic-bezier(.2,.8,.2,1)',
      }
    )
  }

  increaseSize() {
    this.sizeTitle.update((previousSize) => previousSize + 1);
    event?.stopPropagation();

    const tabSig = this.tabDecoratorView?.nativeElement; 
    tabSig.animate(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(1.05)' },
        { transform: 'scale(1)' },
      ],
      {
        duration: 200,
        easing: 'ease-out',
      }
    );
  }

  decreaseSize() {
    if (this.sizeTitle() > 10) {
      this.sizeTitle.update((previousSize) => previousSize - 1);
    }
    event?.stopPropagation();
  }
}
