import { Component, computed, inject, signal } from '@angular/core';
import { MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { QuestionService } from '../../../../services/question.service';
import { tap } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { GestionQuestionsComponent } from '../gestion-questions.component';
import { ImportError } from '../../../../models/import-errors.model';
import { Question } from '../../../../models/question.model';
import { ChampButton } from '../../../../shared/champ/champ-button/champ-button';
import { ChampLabel } from '../../../../shared/champ/champ-label/champ-label';

@Component({
  selector: 'app-import-question-dialog.component',
  imports: [
    CommonModule,
    MatDialogModule,
    MatDialogTitle,
    MatIconModule,
    MatProgressSpinnerModule,
    ChampButton,
    ChampLabel,
  ],
  templateUrl: './import-question-dialog.component.html',
  styleUrl: './import-question-dialog.component.scss',
})
export class ImportQuestionDialogComponent {
  readonly dialogRef = inject(MatDialogRef<GestionQuestionsComponent>);

  csvFileContent = signal<string | ArrayBuffer | null>(null);
  isChecking = signal<boolean>(false);
  checkDone = signal<boolean>(false);
  errorsImport = signal<ImportError[]>([]);
  fileName = signal<string>('');

  canImportFile = computed(
    () => this.errorsImport().filter((error) => error.type === 'error').length === 0,
  );

  constructor(private questionService: QuestionService) {}

  onFileSelected($event: Event) {
    this.checkDone.set(false);
    const input = $event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.fileName.set(file.name);

      const reader = new FileReader();
      reader.onload = () => {
        this.csvFileContent.set(reader.result);
      };
      reader.readAsText(file, 'UTF-8');
    }
  }

  checkImportQuestion() {
    this.isChecking.set(true);
    this.questionService
      .checkImportQuestions(this.csvFileContent())
      .pipe(
        tap((reponse: { erreurs: ImportError[]; questions: Question[] }) => {
          this.isChecking.set(false);
          this.checkDone.set(true);
          this.errorsImport.set(reponse.erreurs);
        }),
      )
      .subscribe();
  }

  importQuestions() {
    this.isChecking.set(true);
    this.questionService
      .importQuestions(this.csvFileContent())
      .pipe(
        tap((reponse: { erreurs: ImportError[]; questions: Question[] }) => {
          this.isChecking.set(false);
          if (reponse.erreurs.length) {
            this.errorsImport.set(reponse.erreurs);
          } else {
            this.dialogRef.close(reponse.questions);
          }
        }),
      )
      .subscribe();
  }
}
