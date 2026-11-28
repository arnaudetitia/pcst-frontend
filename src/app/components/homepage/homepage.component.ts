import { Component, inject, OnInit, signal } from '@angular/core';
import { ChampButton } from '../../shared/champ/champ-button/champ-button';
import { HealthStore } from '../../stores/health.store';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LobbyPartieComponent } from './lobby-partie.component/lobby-partie.component';
import { PartieStore } from '../../stores/partie.store';
import { EquipeStore } from '../../stores/equipe.store';

@Component({
  selector: 'app-homepage.component',
  imports: [ChampButton],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent implements OnInit {
  backendAwake = signal<boolean>(false);

  lobbyPartieDialog = inject(MatDialog);

  constructor(
    private healthStore: HealthStore,
    private partieStore: PartieStore,
    private equipeStore: EquipeStore,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.healthStore.backendAwake$
      .pipe(
        tap((isAwake) => {
          this.backendAwake.set(isAwake);
        }),
      )
      .subscribe();
  }

  goToGestionQuestions() {
    this.router.navigate(['admin', 'gestion-questions']);
  }

  goToGestionParties() {
    this.router.navigate(['admin', 'gestion-parties']);
  }

  openLobby() {
    const dialogRef = this.lobbyPartieDialog.open(LobbyPartieComponent, {
      width: '75vw',
      disableClose: true,
    });

    dialogRef
      .afterClosed()
      .pipe(
        tap((partieData) => {
          this.partieStore.setIdCurrentPartie(partieData.idPartie);
          this.equipeStore.initScores(partieData.equipes);
          this.router.navigate(['partie']);
        }),
      )
      .subscribe();
  }
}
