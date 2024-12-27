import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from './task.service';
@Injectable({
  providedIn: 'root',
})
export class ColumnService {
  private apiUrl = 'http://localhost:8080/columns';

  constructor(private http: HttpClient) {}

  getColumns(boardId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${boardId}`);
  }

  addColumn(column: {
    boardId: number;
    status: string;
    position: number;
  }): Observable<void> {
    return this.http.post<void>(this.apiUrl, column);
  }

  deleteColumn(boardId: number, name: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${boardId}/${name}`);
  }
}
