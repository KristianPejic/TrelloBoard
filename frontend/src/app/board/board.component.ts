import { Component, OnInit } from '@angular/core';
import { BoardService, Board } from '../board.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit {
  boards: Board[] = [];
  newBoardName: string = '';

  constructor(private boardService: BoardService) {}

  ngOnInit(): void {
    this.loadBoards();
  }

  loadBoards(): void {
    this.boardService.getAllBoards().subscribe(
      (data) => {
        this.boards = data;
      },
      (error) => console.error('Error fetching boards:', error)
    );
  }

  createBoard(): void {
    if (this.newBoardName.trim()) {
      this.boardService.createBoard(this.newBoardName).subscribe(
        (newBoard) => {
          this.boards.push(newBoard);
          this.newBoardName = '';
        },
        (error) => console.error('Error creating board:', error)
      );
    }
  }

  deleteBoard(id: number): void {
    this.boardService.deleteBoard(id).subscribe(
      () => {
        this.boards = this.boards.filter((board) => board.id !== id); // Remove from UI
      },
      (error) => console.error('Error deleting board:', error)
    );
  }
}
