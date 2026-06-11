import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExpenseSource } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SourceService {
  private url = `${environment.apiUrl}/sources`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ExpenseSource[]> {
    return this.http.get<ExpenseSource[]>(this.url);
  }

  create(source: ExpenseSource): Observable<ExpenseSource> {
    return this.http.post<ExpenseSource>(this.url, source);
  }

  update(id: number, source: ExpenseSource): Observable<ExpenseSource> {
    return this.http.put<ExpenseSource>(`${this.url}/${id}`, source);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
