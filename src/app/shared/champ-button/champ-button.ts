import { Component, Input } from '@angular/core';

@Component({
  selector: 'champ-button',
  imports: [],
  templateUrl: './champ-button.html',
  styleUrl: './champ-button.scss',
})
export class ChampButton {
  @Input() text: string = '';

  @Input() ratio: number = 0;

  get viewBox(): string {
    return `0 0 ${this.ratio * 100} 100`;
  }

  get pathD(): string {
    const width = this.ratio * 100;
    return `M 10 0 H ${width - 10} L ${width - 100} 100 H 100 Z`;
  }
}
