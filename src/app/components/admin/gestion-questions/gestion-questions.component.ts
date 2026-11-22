import { Component, inject, OnInit, signal } from '@angular/core';
import { BoutonRetourComponent } from '../../../shared/bouton-retour/bouton-retour.component';
import { ChampLabel } from '../../../shared/champ/champ-label/champ-label';
import { QuestionService } from '../../../services/question.service';
import { Question } from '../../../models/question.model';
import { tap } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AddEditQuestionDialogComponent } from './add-edit-question-dialog.component/add-edit-question-dialog.component';
import { ChampButton } from '../../../shared/champ/champ-button/champ-button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-gestion-questions.component',
  imports: [
    CommonModule,
    BoutonRetourComponent,
    ChampLabel,
    ChampButton,
    MatMenuModule,
    MatTableModule,
  ],
  templateUrl: './gestion-questions.component.html',
  styleUrl: './gestion-questions.component.scss',
})
export class GestionQuestionsComponent implements OnInit {
  allQuestions = signal(new MatTableDataSource<Question>([]));

  displayedColumns = ['question', 'reponses'];

  openAddEditQuestionDialog = inject(MatDialog);

  constructor(private questionsService: QuestionService) {}

  ngOnInit(): void {
    this.questionsService
      .getAllQuestions()
      .pipe(
        tap((questions) => {
          this.allQuestions().data = questions;
        }),
      )
      .subscribe();
  }

  openAddQuestionDialog() {
    const dialogRef = this.openAddEditQuestionDialog.open(AddEditQuestionDialogComponent, {
      data: {
        action: 'add',
      },
      width: '75vw',
      disableClose: true,
    });

    dialogRef
      .afterClosed()
      .pipe(
        tap((questionUpdated) => {
          if (questionUpdated) {
            this.allQuestions().data = questionUpdated;
          }
        }),
      )
      .subscribe();
  }
}
