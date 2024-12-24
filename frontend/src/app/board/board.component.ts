import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BoardService, Board } from '../board.service';
import { Router } from '@angular/router';
import { SearchService } from '../services/search.service';
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

  constructor(
    private boardService: BoardService,
    private router: Router,
    private searchService: SearchService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadBoards();
    this.fetchBoards();
    this.searchService.currentSearchTerm.subscribe((term) => {
      this.searchTerm = term;
      this.filterBoards();
    });
  }
  addBoard(): void {
    if (this.newBoardName.trim()) {
      // Create a Board object with name and a random color
      const newBoard: Board = {
        name: this.newBoardName.trim(),
        color: this.getRandomColor(), // Generate a random color
      };

      // Call the createBoard service with the Board object
      this.boardService.createBoard(newBoard).subscribe(
        (createdBoard) => {
          this.boards.push(createdBoard); // Add the new board to the list
          this.newBoardName = ''; // Clear the input field
          console.log('Board created:', createdBoard);
        },
        (error) => console.error('Error creating board:', error)
      );
    }
  }

  fetchBoards(): void {
    this.boardService.getAllBoards().subscribe(
      (boards) => {
        this.boards = boards; // Update the UI
      },
      (error) => console.error('Error fetching boards:', error)
    );
  }

  loadBoards(): void {
    this.boardService.getAllBoards().subscribe(
      (data) => {
        this.boards = data;
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
      this.filteredBoards = [...this.boards]; // Reset to all boards if search term is empty
    }
  }
  createBoard(): void {
    if (this.newBoardName.trim()) {
      // Create a Board object with name and a random color
      const newBoard: Board = {
        name: this.newBoardName.trim(),
        color: this.getRandomColor(), // Generate a random color
      };

      // Call the createBoard service with the Board object
      this.boardService.createBoard(newBoard).subscribe(
        (createdBoard) => {
          this.boards.push(createdBoard); // Add the new board to the list dynamically
          this.filteredBoards = [...this.boards]; // Update filtered boards
          this.newBoardName = ''; // Clear the input field
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
    event.stopPropagation(); // Prevent navigation when clicking delete
    this.boardService.deleteBoard(id).subscribe(() => {
      this.boards = this.boards.filter((board) => board.id !== id);
      this.filterBoards();
    });
  }
}
