import { Component, OnInit, signal } from '@angular/core';
import { BoutonRetourComponent } from '../../../shared/bouton-retour/bouton-retour.component';
import { ChampLabel } from '../../../shared/champ/champ-label/champ-label';
import { QuestionService } from '../../../services/question.service';
import { Question } from '../../../models/question.model';
import { tap } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gestion-questions.component',
  imports: [CommonModule, BoutonRetourComponent, ChampLabel, MatTableModule],
  templateUrl: './gestion-questions.component.html',
  styleUrl: './gestion-questions.component.scss',
})
export class GestionQuestionsComponent implements OnInit {
  allQuestions = signal(new MatTableDataSource<Question>([]));

  displayedColumns = ['question', 'reponses'];

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
}
