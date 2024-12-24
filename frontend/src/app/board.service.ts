import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Board {
  id?: number;
  name: string;
  color: string;
}

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private apiUrl = 'http://localhost:8080/boards'; // Your backend API

  constructor(private http: HttpClient) {}

  getAllBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(this.apiUrl);
  }

  createBoard(name: string): Observable<Board> {
    const randomColor = this.getRandomColor();
    const board: Board = { name, color: randomColor };
    return this.http.post<Board>(this.apiUrl, board); // Expect the full board object
  }
  deleteBoard(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
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
