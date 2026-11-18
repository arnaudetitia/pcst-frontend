import { Component, OnInit, signal } from '@angular/core';
import { ChampButton } from '../../shared/champ/champ-button/champ-button';
import { HealthStore } from '../../stores/health.store';
import { tap } from 'rxjs';

@Component({
  selector: 'app-homepage.component',
  imports: [ChampButton],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent implements OnInit {
  backendAwake = signal<boolean>(false);

  constructor(private healthStore: HealthStore) {}

  ngOnInit(): void {
    this.healthStore.backendAwake$
      .pipe(
        tap((isAwake) => {
          this.backendAwake.set(isAwake);
        }),
      )
      .subscribe();
  }
}
