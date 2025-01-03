import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { BoardService, Board } from '../board.service';
import { Router } from '@angular/router';
import { SearchService } from '../services/search.service';
import { HttpClient } from '@angular/common/http';
import { TaskService } from '../services/task.service';
@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  standalone: false,
})
export class BoardComponent implements OnInit {
  boards: Board[] = [];
  newBoardName: string = '';
  filteredBoards: Board[] = [];
  searchTerm: string = '';
  @Input() boardId!: number;

  constructor(
    private boardService: BoardService,
    private router: Router,
    private searchService: SearchService,
    private cdr: ChangeDetectorRef,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.fetchBoards();

    this.searchService.currentSearchTerm.subscribe((term) => {
      this.searchTerm = term;
      this.filterBoards();
    });
  }
  addBoard(): void {
    if (this.newBoardName.trim()) {
      const newBoard: Board = {
        name: this.newBoardName.trim(),
        color: this.getRandomColor(),
      };

      this.boardService.createBoard(newBoard).subscribe(
        (createdBoard) => {
          this.boards.push(createdBoard);
          this.newBoardName = '';
          console.log('Board created:', createdBoard);
        },
        (error) => console.error('Error creating board:', error)
      );
    }
  }

  fetchBoards(): void {
    this.boardService.getAllBoards().subscribe(
      (boards) => {
        this.boards = boards;
        this.filteredBoards = [...this.boards];
      },
      (error) => console.error('Error fetching boards:', error)
    );
  }

  filterBoards(): void {
    if (this.searchTerm.trim()) {
      this.filteredBoards = this.boards.filter((board) =>
        board.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredBoards = [...this.boards];
    }
  }
  createBoard(): void {
    if (this.newBoardName.trim()) {
      const newBoard: Board = {
        name: this.newBoardName.trim(),
        color: this.getRandomColor(),
      };

      this.boardService.createBoard(newBoard).subscribe(
        (createdBoard) => {
          this.boards.push(createdBoard);
          this.filteredBoards = [...this.boards];
          this.newBoardName = '';
          console.log('Board created:', createdBoard);
        },
        (error) => console.error('Error creating board:', error)
      );
    }
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  deleteBoard(event: Event, id: number): void {
    event.preventDefault();
    event.stopPropagation();
    this.boardService.deleteBoard(id).subscribe(() => {
      this.boards = this.boards.filter((board) => board.id !== id);
      this.filteredBoards = [...this.boards];
    });
  }
}
