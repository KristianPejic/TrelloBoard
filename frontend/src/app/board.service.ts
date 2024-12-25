import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Board {
  id?: number;
  name: string;
  color: string;
}
const baseUrl = `http://localhost:4200`;

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private apiUrl = 'http://localhost:8080/boards';

  constructor(private http: HttpClient) {}

  getAllBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(this.apiUrl);
  }

  getBoardById(boardId: number): Observable<Board> {
    return this.http.get<Board>(`${this.apiUrl}/${boardId}`);
  }

  createBoard(board: Board): Observable<Board> {
    return this.http.post<Board>(this.apiUrl, board);
  }
  deleteBoard(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
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
  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
