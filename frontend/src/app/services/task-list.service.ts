import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from './task.service';

export interface TaskList {
  id: number;
  name: string;
  boardId: number;
  tasks: Task[];
}

@Injectable({
  providedIn: 'root',
})
export class ListService {
  private apiUrl = 'http://localhost:8080/lists';

  constructor(private http: HttpClient) {}

  getListsByBoard(boardId: number): Observable<TaskList[]> {
    return this.http.get<TaskList[]>(`${this.apiUrl}/board/${boardId}`);
  }

  createList(name: string, boardId: number): Observable<void> {
    return this.http.post<void>(this.apiUrl, { name, boardId });
  }
  sanitizeId(name: string): string {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }
  deleteList(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
