import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';

@NgModule({
  declarations: [AppComponent, BoardComponent],
  imports: [
    BrowserModule,
    FormsModule, // Add FormsModule here
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
