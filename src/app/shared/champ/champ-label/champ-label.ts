import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'champ-label',
  imports: [CommonModule],
  templateUrl: '../common/champ.html',
  styleUrl: './champ-label.scss',
})
export class ChampLabel {
  @Input() text: string = '';

  @Input() ratio: number = 0;

  @Input() colorFill = '#a7074b';

  @Input() inactivated: boolean = false;

  handleClick(event: MouseEvent): void {
    if (this.inactivated) {
      event.stopPropagation();
    }
  }

  get viewBox(): string {
    return `0 0 ${this.ratio * 100} 100`;
  }

  get pathD(): string {
    const width = this.ratio * 100;
    return `M 10 0 H ${width - 10} L ${width - 100} 100 H 100 Z`;
  }
}
