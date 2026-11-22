import { Component, effect, inject, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ChampButton } from '../../../../shared/champ/champ-button/champ-button';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Question, QuestionVo } from '../../../../models/question.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { catchError, of, tap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { QuestionService } from '../../../../services/question.service';
import { GestionQuestionsComponent } from '../gestion-questions.component';

export interface Marge {
  borneInf: number;
  borneSup: number | null;
}

@Component({
  selector: 'app-add-edit-question-dialog.component',
  imports: [
    CommonModule,
    MatDialogModule,
    MatDialogTitle,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ChampButton,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-edit-question-dialog.component.html',
  styleUrl: './add-edit-question-dialog.component.scss',
})
export class AddEditQuestionDialogComponent {
  readonly dialogRef = inject(MatDialogRef<GestionQuestionsComponent>);
  questionForm: FormGroup;

  motIndiceOptionList = signal<string[]>([]);

  indexValues: number[] = Array.from({ length: 10 }, (_, i) => i);

  marges = signal<Marge[]>(
    Array.from({ length: 10 }, (_, i) => {
      return {
        borneInf: i - 1,
        borneSup: null,
      } as Marge;
    }),
  );

  indexBonneReponse = signal<number | null>(null);

  data = inject<{ action: 'add' | 'edit'; question?: Question }>(MAT_DIALOG_DATA);

  stopWords = new Set([
    // Articles
    'le',
    'la',
    'les',
    'un',
    'une',
    'des',
    'du',
    'de',
    'd',

    // Pronoms
    'je',
    'tu',
    'il',
    'elle',
    'nous',
    'vous',
    'ils',
    'elles',
    'on',
    'ce',
    'cet',
    'cette',
    'ces',
    'qui',
    'que',
    'quoi',

    // Prépositions et conjonctions
    'à',
    'au',
    'aux',
    'dans',
    'sur',
    'avec',
    'sans',
    'pour',
    'par',
    'en',
    'vers',
    'entre',
    'comme',
    'et',
    'ou',
    'mais',
    'donc',

    // Questions
    'combien',
    'quelle',
    'quel',
    'quelles',
    'quels',
    'pourquoi',
    'comment',
    'quand',
    'est',
    'sont',
    'a',
    'ai',
    'avoir',
  ]);

  constructor(
    private fb: FormBuilder,
    private questionService: QuestionService,
  ) {
    const questionToEdit = this.data.question || ({} as Question);
    this.questionForm = this.fb.group({
      question: [questionToEdit.question, Validators.required],
      motIndice: [questionToEdit.motIndice, Validators.required],
      reponses: this.fb.array([]),
    });

    this.updateOptionMotIndiceList(this.questionForm.get('question')?.value);

    this.questionForm
      .get('question')
      ?.valueChanges.pipe(
        tap((question) => {
          this.updateOptionMotIndiceList(question);
        }),
      )
      .subscribe();

    this.reponsesForm.push(
      this.indexValues.map((_, i) =>
        this.fb.group({
          value: [
            questionToEdit && questionToEdit.reponses ? questionToEdit.reponses[i] : '',
            [
              Validators.required,
              Validators.min(this.marges()[i].borneInf),
              Validators.max(this.marges()[i].borneSup || Number.MAX_VALUE),
            ],
          ],
        }),
      ),
    );

    if (questionToEdit && questionToEdit.bonneReponse) {
      this.indexBonneReponse.set(
        questionToEdit.reponses.findIndex((reponse) => reponse === questionToEdit.bonneReponse),
      );
    }

    const isReponse = (value: number | null): value is number =>
      typeof value === 'number' && Number.isFinite(value);

    this.reponsesForm.valueChanges
      .pipe(
        tap((reponses: { value: number | null }[]) => {
          const reponseValues = reponses.map((reponse) => reponse.value as number | null);
          const updatedMarge = reponses.map((_, index) => {
            let borneMin, borneMax;
            switch (index) {
              case 0:
                borneMax = reponseValues.slice(1).find(isReponse);
                return {
                  borneInf: 0,
                  borneSup: borneMax !== undefined ? borneMax - 1 : Number.MAX_VALUE,
                };
              case 9:
                borneMin = reponseValues.slice(0, 9).filter(isReponse).at(-1);
                return { borneInf: borneMin !== undefined ? borneMin + 1 : 0, borneSup: null };
              default:
                borneMin = reponseValues.slice(0, index).filter(isReponse).at(-1);
                borneMax = reponseValues.slice(index + 1).find((reponse) => reponse !== null);
                return {
                  borneInf: borneMin ? borneMin + 1 : 0,
                  borneSup: borneMax ? borneMax - 1 : Number.MAX_VALUE,
                };
            }
          });
          this.marges.set(updatedMarge);
          this.reponsesForm.controls.forEach((control, i) => {
            const valueControl = (control as FormGroup).get('value');

            valueControl?.setValidators([
              Validators.required,
              Validators.min(this.marges()[i].borneInf),
              Validators.max(this.marges()[i].borneSup ?? Number.MAX_VALUE),
            ]);

            valueControl?.updateValueAndValidity({ emitEvent: false });
          });
        }),
      )
      .subscribe();
  }

  get reponsesForm() {
    return this.questionForm.get('reponses') as FormArray;
  }

  updateOptionMotIndiceList(question: string) {
    const words =
      typeof question === 'string'
        ? question
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .split(/[^\p{L}\p{N}]+/u)
            .filter((word) => word.length > 2)
            .filter((word) => !this.stopWords.has(word))
        : [];
    this.motIndiceOptionList.set(
      [...new Set(words.filter(Boolean))].map(
        (mot) => mot.charAt(0).toUpperCase() + mot.slice(1).toLowerCase(),
      ),
    );
  }

  updateIndexBonneReponse(newIndex: number) {
    this.indexBonneReponse.set(newIndex);
  }

  addEditQuestion() {
    const questionVo: QuestionVo = {
      question: this.questionForm.get('question')?.value,
      motIndice: this.questionForm.get('motIndice')?.value,
      bonneReponse: this.reponsesForm?.value[this.indexBonneReponse() ?? -1].value,
      reponses: this.reponsesForm?.value.map((reponse: any) => reponse.value),
    };

    const addEditObservable =
      this.data.action === 'add'
        ? this.questionService.createQuestion(questionVo)
        : this.questionService.updateQuestion(this.data.question?.id, questionVo);

    addEditObservable
      .pipe(
        tap((questionsUpdated) => {
          this.dialogRef.close(questionsUpdated);
        }),
        catchError((error) => {
          console.log(error);
          return of();
        }),
      )
      .subscribe();
  }
}
