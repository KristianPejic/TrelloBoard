import { Component, OnInit } from '@angular/core';
import { TaskService, Task } from '../services/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CdkDragDrop,
  transferArrayItem,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { Board, BoardService } from '../board.service';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.css'],
  standalone: false,
})
export class TaskBoardComponent implements OnInit {
  toDoTasks: Task[] = [];
  doingTasks: Task[] = [];
  doneTasks: Task[] = [];
  newTaskTitle: string = '';
  showInput: boolean = false;
  boardId!: number;
  boardName: string = 'Loading...';

  // Default Columns
  columns: { name: string; status: string }[] = [
    { name: 'To Do', status: 'To Do' },
    { name: 'Doing', status: 'Doing' },
    { name: 'Done', status: 'Done' },
  ];

  dynamicColumns: { name: string; tasks: Task[] }[] = [];
  newColumnName: string = '';
  connectedDropLists: string[] = [];

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router,
    private boardService: BoardService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.boardId = +params['id'];
      this.fetchTasks();
      this.fetchBoardName();
    });

    this.initializeDropLists();
  }

  initializeDropLists(): void {
    this.connectedDropLists = ['to-do-list', 'doing-list', 'done-list'];
    this.dynamicColumns.forEach((column) => {
      const columnId = column.name.toLowerCase().replace(/\s+/g, '-');
      this.connectedDropLists.push(columnId);
    });
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

  navigateToBoardSelection(): void {
    this.router.navigate(['/boards']);
  }

  fetchTasks(): void {
    this.taskService
      .getTasksByBoard(this.boardId)
      .subscribe((tasks: Task[]) => {
        this.toDoTasks = tasks.filter((task) => task.status === 'To Do');
        this.doingTasks = tasks.filter((task) => task.status === 'Doing');
        this.doneTasks = tasks.filter((task) => task.status === 'Done');

        // Assign tasks to dynamic columns
        this.dynamicColumns.forEach((column) => {
          column.tasks = tasks.filter((task) => task.status === column.name);
        });
      });
  }

  addTask(): void {
    if (this.newTaskTitle.trim()) {
      const newTask: Task = {
        title: this.newTaskTitle,
        status: 'To Do', // Default to "To Do"
        boardId: this.boardId,
      };

      this.taskService.addTask(newTask).subscribe(
        () => {
          this.fetchTasks();
          this.newTaskTitle = '';
        },
        (err) => console.error('Error adding task:', err)
      );
    }
  }

  addColumn(): void {
    if (this.newColumnName.trim()) {
      const columnId = this.newColumnName.toLowerCase().replace(/\s+/g, '-');
      this.dynamicColumns.push({ name: this.newColumnName, tasks: [] });
      this.connectedDropLists.push(columnId);
      this.newColumnName = '';
    }
  }

  deleteColumn(column: { name: string; tasks: Task[] }): void {
    const index = this.dynamicColumns.indexOf(column);
    if (index !== -1) {
      this.dynamicColumns.splice(index, 1);
      this.connectedDropLists = this.connectedDropLists.filter(
        (id) => id !== column.name.toLowerCase().replace(/\s+/g, '-')
      );
    }
  }

  drop(event: CdkDragDrop<Task[]>, targetStatus: string): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      task.status = targetStatus;

      if (task.id != undefined) {
        this.taskService.updateTaskStatus(task.id, task.status).subscribe(
          () => {
            transferArrayItem(
              event.previousContainer.data,
              event.container.data,
              event.previousIndex,
              event.currentIndex
            );
          },
          (err) => console.error('Error updating task status:', err)
        );
      } else {
        console.error('Task ID is undefined!');
      }
    }
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
