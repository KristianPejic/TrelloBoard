import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardComponent } from './board/board.component';
import { TaskBoardComponent } from './task-board/task-board.component';

const routes: Routes = [
  { path: '', component: BoardComponent },
  { path: 'board/:id', component: TaskBoardComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
