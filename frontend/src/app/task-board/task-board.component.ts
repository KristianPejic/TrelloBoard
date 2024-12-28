import { Component, OnInit } from '@angular/core';
import { TaskService, Task } from '../services/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CdkDragDrop,
  transferArrayItem,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { Board, BoardService } from '../board.service';
import { ColumnService } from '../services/column.service';
interface Column {
  name: string;
  tasks: Task[];
  showInput?: boolean;
  newTaskTitle?: string;
}
@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.css'],

  standalone: false,
})
export class TaskBoardComponent implements OnInit {
  boardId!: number;
  boardName: string = 'Loading...';
  progress: number = 0;

  dynamicColumns: {
    name: string;
    tasks: Task[];
    showInput: boolean;
    newTaskTitle: string;
    position: number;
  }[] = [];

  newColumnName: string = '';
  connectedDropLists: string[] = [];

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router,
    private boardService: BoardService,
    private columnService: ColumnService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.boardId = +params['id'];
      this.fetchTasks();
      this.fetchBoardName();
      this.fetchProgress();
      this.loadDynamicColumns();
    });
    this.initializeDropLists();
  }

  initializeDropLists(): void {
    this.connectedDropLists = this.dynamicColumns.map((col) =>
      col.name.toLowerCase().replace(/\s+/g, '-')
    );
  }
  fetchBoardName(): void {
    this.boardService.getBoardById(this.boardId).subscribe(
      (board: Board) => {
        this.boardName = board.name;
      },
      (error) => {
        console.error('Failed to fetch board name', error);
        this.boardName = 'Unknown Board';
      }
    );
  }
  fetchProgress(): void {
    this.taskService.getBoardProgress(this.boardId).subscribe(
      (data) => {
        this.progress = data.progress;
      },
      (error) => {
        console.error('Error fetching progress:', error);
        this.progress = 0;
      }
    );
  }

  navigateToBoardSelection(): void {
    this.router.navigate(['/boards']);
  }

  fetchTasks(): void {
    this.taskService
      .getTasksByBoard(this.boardId)
      .subscribe((tasks: Task[]) => {
        this.dynamicColumns.forEach((column) => (column.tasks = []));

        tasks.forEach((task) => {
          const column = this.dynamicColumns.find(
            (col) => col.name === task.status
          );
          if (column) {
            column.tasks.push(task);
          }
        });
      });
  }

  addTask(column: {
    name: string;
    tasks: Task[];
    showInput: boolean;
    newTaskTitle: string;
  }): void {
    if (column.newTaskTitle?.trim()) {
      const newTask: Task = {
        title: column.newTaskTitle.trim(),
        status: column.name,
        boardId: this.boardId,
      };

      this.taskService.addTask(newTask).subscribe(
        () => {
          this.fetchTasks();
          column.newTaskTitle = '';
          column.showInput = false;
        },
        (err) =>
          console.error(`Error adding task to column "${column.name}":`, err)
      );
    } else {
      console.warn(`Task title is empty. Task not added.`);
    }
  }
  loadDynamicColumns(): void {
    this.columnService.getColumns(this.boardId).subscribe((columns) => {
      this.dynamicColumns = columns.map((column) => ({
        name: column.name,
        tasks: [],
        showInput: false,
        newTaskTitle: '',
        position: column.position,
      }));

      this.taskService
        .getTasksByBoard(this.boardId)
        .subscribe((tasks: Task[]) => {
          tasks.forEach((task) => {
            const column = this.dynamicColumns.find(
              (col) => col.name === task.status
            );
            if (column) {
              column.tasks.push(task);
            }
          });

          this.initializeDropLists();
        });
    });
  }

  addColumn(): void {
    if (this.newColumnName.trim()) {
      const newColumn = {
        boardId: this.boardId,
        status: this.newColumnName,
        position: this.dynamicColumns.length,
      };

      this.columnService.addColumn(newColumn).subscribe(() => {
        this.dynamicColumns.push({
          name: this.newColumnName,
          tasks: [],
          showInput: false,
          newTaskTitle: '',
          position: newColumn.position,
        });
        this.newColumnName = '';
        this.initializeDropLists();
      });
    } else {
      console.warn('Column name is empty. Column not added.');
    }
  }

  getColumnId(columnName: string): string {
    return columnName.toLowerCase().replace(/\s+/g, '-');
  }
  deleteColumn(column: Column): void {
    if (
      confirm(`Are you sure you want to delete the column "${column.name}"?`)
    ) {
      this.columnService
        .deleteColumn(this.boardId, column.name)
        .subscribe(() => {
          this.dynamicColumns = this.dynamicColumns.filter(
            (col) => col.name !== column.name
          );
          this.initializeDropLists(); // Update drop lists after deletion
          console.log(`Column "${column.name}" deleted successfully`);
        });
    }
  }

  drop(event: CdkDragDrop<Task[]>, targetStatus: string): void {
    const task = event.previousContainer.data[event.previousIndex];
    task.status = targetStatus;

    if (task.id) {
      this.taskService.updateTaskStatus(task.id, task.status).subscribe(() => {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
        this.fetchProgress();
      });
    }
  }
  dropColumn(event: CdkDragDrop<Column[]>): void {
    moveItemInArray(
      this.dynamicColumns,
      event.previousIndex,
      event.currentIndex
    );
  }

  deleteTask(task: Task): void {
    if (confirm(`Are you sure you want to delete the task "${task.title}"?`)) {
      this.taskService.deleteTask(task.id!).subscribe({
        next: () => {
          console.log(`Task "${task.title}" deleted successfully`);
          this.fetchTasks();
        },
        error: (err) => console.error('Error deleting task:', err),
      });
    }
  }

  toggleEdit(task: Task): void {
    task.isEditing = !task.isEditing;
  }

  saveEdit(task: Task): void {
    if (task.id && task.title.trim() !== '') {
      this.taskService.updateTaskTitle(task.id, task.title).subscribe(
        () => {
          task.isEditing = false;
          console.log('Task title updated successfully');
        },
        (err) => console.error('Error updating task title:', err)
      );
    } else {
      console.warn('Task ID or title is invalid');
    }
  }
}
