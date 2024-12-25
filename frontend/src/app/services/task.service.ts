import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Task {
  id?: number;
  title: string;
  status: string;
  boardId: number;
  isEditing?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:8080/tasks';

  constructor(private http: HttpClient) {}

  getTasksByBoard(boardId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/board/${boardId}`);
  }

  getBoardById(boardId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/boards/${boardId}`);
  }

  addTask(task: Task): Observable<void> {
    return this.http.post<void>(this.apiUrl, task);
  }
  getBoardProgress(
    boardId: number
  ): Observable<{ totalTasks: number; doneTasks: number; progress: number }> {
    return this.http.get<{
      totalTasks: number;
      doneTasks: number;
      progress: number;
    }>(`${this.apiUrl}/board/${boardId}/progress`);
  }
  updateTaskStatus(id: number, status: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, { status });
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateTaskTitle(id: number, title: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/title`, { title });
  }
}
