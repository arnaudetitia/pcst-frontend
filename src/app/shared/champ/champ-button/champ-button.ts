import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ChampLabel } from '../champ-label/champ-label';

@Component({
  selector: 'champ-button',
  imports: [CommonModule, ChampLabel],
  templateUrl: '../common/champ.html',
  styleUrl: './champ-button.scss',
})
export class ChampButton extends ChampLabel {}
