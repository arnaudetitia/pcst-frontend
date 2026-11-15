import { Component } from '@angular/core';
import { ChampButton } from '../../shared/champ-button/champ-button';

@Component({
  selector: 'app-homepage.component',
  imports: [ChampButton],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent {}
