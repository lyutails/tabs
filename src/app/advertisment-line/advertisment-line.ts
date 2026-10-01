import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'tabs-advertisment-line',
  styleUrl: './advertisment-line.scss',
  templateUrl: './advertisment-line.html',
})
export class AdvertismentLine {
  advertismentPhrases: string[] = ['Popular brands', 'from Korea Japan China Europe Russia',
    'Hyped Ingredients', 'PDRN 🧬', 'Backuchiol', 'modern Peptides and Retinol forms 🧪', 'Highly competent frienly consultants 🧝‍♀️',
    'Quick delivery 📦', 'Full day support']
}
