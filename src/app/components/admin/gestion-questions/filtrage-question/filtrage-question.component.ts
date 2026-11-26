import { Component, computed, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FiltreQuestionType } from '../../../../models/enums/filtre-type.enum';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { combineLatest, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'filtrage-question',
  imports: [
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatIconModule,
    MatIconButton,
    MatTooltipModule,
    FormsModule,
  ],
  templateUrl: './filtrage-question.component.html',
  styleUrl: './filtrage-question.component.scss',
})
export class FiltrageQuestionComponent implements OnInit {
  FiltreQuestionType = FiltreQuestionType;
  FiltreQuestionTypeLabels = Object.values(FiltreQuestionType).filter(
    (value) => typeof value === 'string',
  ) as string[];

  //allParties = signal<Partie[]>([]);
  //selectedPartie = signal<Partie | null>(null);

  currentFiltreType = signal<FiltreQuestionType | null>(null);
  currentFiltreTypeLabel = signal<string | null>(null);
  @Output() onFiltreValueChange = new EventEmitter<{
    typeFiltre: FiltreQuestionType;
    value: string | number[] | null;
  }>();

  constructor(
    //private partieService: PartieService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    //combineLatest([this.partieService.getAllParties(), this.activatedRoute.queryParams])
    //  .pipe(
    //    tap(([parties, queryParams]) => {
    //      this.allParties.set(parties);
    //      const idPartieFromUrl = queryParams['idPartie'];
    //      if (idPartieFromUrl) {
    //        const partie = this.allParties().find(
    //          (partie) => partie.id === Number.parseInt(idPartieFromUrl),
    //        );
    //        if (partie) {
    //          this.currentFiltreType.set(FiltreQuestionType.PARTIE);
    //          this.currentFiltreTypeLabel.set('PARTIE');
    //          this.selectedPartie.set(partie);
    //          const idQuestionList = (partie.listeQuestions as any[]).map(
    //            (question) => question.idQuestion,
    //          );
    //          this.onFiltreValueChange.emit({
    //            typeFiltre: FiltreQuestionType.PARTIE,
    //            value: idQuestionList,
    //          });
    //        }
    //      }
    //    }),
    //  )
    //  .subscribe();
  }

  registerFilterType(value: string) {
    this.currentFiltreType.set(FiltreQuestionType[value as keyof typeof FiltreQuestionType]);
    this.onFiltreValueChange.emit({} as any);
  }

  resetFilter() {
    //this.selectedPartie.set(null);
    this.currentFiltreType.set(null);
    this.currentFiltreTypeLabel.set('');
    this.onFiltreValueChange.emit({} as { typeFiltre: FiltreQuestionType; value: any });
  }

  onFilterValueChange($event: any) {
    switch (this.currentFiltreType()) {
      case FiltreQuestionType.TEXTE:
        this.onFiltreValueChange.emit({
          typeFiltre: FiltreQuestionType.TEXTE,
          value: $event as string,
        });
        break;

      case FiltreQuestionType.PARTIE: {
        const idQuestionList = ($event.listeQuestions as any[]).map(
          (question) => question.idQuestion,
        );
        this.onFiltreValueChange.emit({
          typeFiltre: FiltreQuestionType.PARTIE,
          value: idQuestionList,
        });
      }
    }
  }
}
