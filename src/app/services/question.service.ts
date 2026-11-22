import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Question, QuestionVo } from '../models/question.model';

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
}
