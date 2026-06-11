import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Expense, DashboardSummary } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private url = `${environment.apiUrl}/expenses`;

  constructor(private http: HttpClient) {}

  getAll(categoryId?: number, startDate?: string, endDate?: string): Observable<Expense[]> {
    let params = new HttpParams();
    if (categoryId) params = params.set('categoryId', categoryId.toString());
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    return this.http.get<Expense[]>(this.url, { params });
  }

  create(expense: Expense): Observable<Expense> {
    return this.http.post<Expense>(this.url, expense);
  }

  update(id: number, expense: Expense): Observable<Expense> {
    return this.http.put<Expense>(`${this.url}/${id}`, expense);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  bulkDelete(ids: number[]): Observable<void> {
    return this.http.post<void>(`${this.url}/bulk-delete`, ids);
  }

  bulkUpdate(expenses: Partial<Expense>[]): Observable<Expense[]> {
    return this.http.put<Expense[]>(`${this.url}/bulk-update`, expenses);
  }

  importExpenses(expenses: Expense[]): Observable<Expense[]> {
    return this.http.post<Expense[]>(`${this.url}/import`, expenses);
  }

  getSummary(year: number, month: number): Observable<DashboardSummary> {
    const params = new HttpParams().set('year', year.toString()).set('month', month.toString());
    return this.http.get<DashboardSummary>(`${this.url}/summary`, { params });
  }
}
