import { Component, inject } from '@angular/core';
import { Navigate } from '../services/navigate';
import { TitleHighlight } from '../directives/title-highlight/title-highlight';

@Component({
  imports: [TitleHighlight],
  selector: 'tabs-footer',
  styleUrl: './footer.scss',
  templateUrl: './footer.html',
})
export class Footer {
}
