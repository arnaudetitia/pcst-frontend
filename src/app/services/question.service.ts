import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Question, QuestionVo } from '../models/question.model';
import { ImportError } from '../models/import-errors.model';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  constructor(private http: HttpClient) {}

  getAllQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${environment.apiUrl}/questions`);
  }

  createQuestion(question: QuestionVo): Observable<Question[]> {
    return this.http.post<Question[]>(`${environment.apiUrl}/questions`, { question });
  }

  updateQuestion(idQuestion: number | undefined, question: QuestionVo) {
    return this.http.put<Question[]>(`${environment.apiUrl}/questions`, { idQuestion, question });
  }

  checkImportQuestions(
    csvFileContent: any,
  ): Observable<{ erreurs: ImportError[]; questions: Question[] }> {
    return this.http.post<{ erreurs: ImportError[]; questions: Question[] }>(
      environment.apiUrl + `/questions/import`,
      {
        csvFileContent,
        doImport: false,
      },
    );
  }

  importQuestions(
    csvFileContent: any,
  ): Observable<{ erreurs: ImportError[]; questions: Question[] }> {
    return this.http.post<{ erreurs: ImportError[]; questions: Question[] }>(
      environment.apiUrl + `/questions/import`,
      {
        csvFileContent,
        doImport: true,
      },
    );
  }
}
