import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, of, take, tap } from 'rxjs';
import { ResultatManche } from '../models/resultat-manches.model';

@Injectable({
  providedIn: 'root',
})
export class EquipeStore {
  resultatsManchesEquipesSubject = new BehaviorSubject<Map<string, ResultatManche[]>>(new Map());
  resultatsManchesEquipes$ = this.resultatsManchesEquipesSubject.asObservable();

  equipeEnJeuSource = new BehaviorSubject<string>('');
  equipeEnJeu$ = this.equipeEnJeuSource.asObservable();

  constructor() {}

  initScores(equipes: string[]) {
    const initialResultatsEquipes = new Map();
    equipes.forEach((equipe) => {
      initialResultatsEquipes.set(equipe, Array(5).fill(null));
    });
    this.resultatsManchesEquipesSubject.next(initialResultatsEquipes);
    this.equipeEnJeuSource.next(equipes[0]);
  }

  setScore(points: number, ecart: number) {
    combineLatest([this.equipeEnJeu$, this.resultatsManchesEquipes$])
      .pipe(
        take(1),
        tap(([equipeEnJeu, resultatMap]) => {
          const previousScoresEquipe = resultatMap.get(equipeEnJeu);
          if (previousScoresEquipe) {
            const indexToFill = previousScoresEquipe.findIndex(
              (previoiusScore) => previoiusScore === null,
            );
            if (indexToFill !== -1) {
              let newScoresEquipe = [...previousScoresEquipe];
              newScoresEquipe[indexToFill] = { points, ecart };
              const newMap = new Map(resultatMap);
              newMap.set(equipeEnJeu, newScoresEquipe);
              this.resultatsManchesEquipesSubject.next(newMap);
            }
          }
        }),
      )
      .subscribe();
  }
}
