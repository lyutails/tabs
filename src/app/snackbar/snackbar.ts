import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  imports: [MatButtonModule],
  selector: 'tabs-snackbar',
  styleUrl: './snackbar.scss',
  templateUrl: './snackbar.html',
})
export class Snackbar {
  private snackBar = inject(MatSnackBar);

  openSnackbar(message: string, action: string): void {
    this.snackBar.open(message, action);
  }
}