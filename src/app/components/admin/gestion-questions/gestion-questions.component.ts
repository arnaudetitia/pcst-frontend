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
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ImportQuestionDialogComponent } from './import-question-dialog.component/import-question-dialog.component';

@Component({
  selector: 'app-gestion-questions.component',
  imports: [
    CommonModule,
    BoutonRetourComponent,
    ChampLabel,
    ChampButton,
    MatMenuModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './gestion-questions.component.html',
  styleUrl: './gestion-questions.component.scss',
})
export class GestionQuestionsComponent implements OnInit {
  allQuestions = signal(new MatTableDataSource<Question>([]));

  displayedColumns = ['question', 'reponses', 'action'];

  openAddEditQuestionDialog = inject(MatDialog);
  openImportDialog = inject(MatDialog);

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

  openEditQuestionDialog(question: Question) {
    const dialogRef = this.openAddEditQuestionDialog.open(AddEditQuestionDialogComponent, {
      data: {
        action: 'edit',
        question,
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

  openImportQuestionsDialog() {
    const dialogRef = this.openImportDialog.open(ImportQuestionDialogComponent, {
      width: '75vw',
      disableClose: true,
    });

    dialogRef
      .afterClosed()
      .pipe(
        tap((questionListUpdated) => {
          if (questionListUpdated) {
            this.allQuestions().data = questionListUpdated;
          }
        }),
      )
      .subscribe();
  }
}
