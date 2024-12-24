import { Component } from '@angular/core';
import { SearchService } from './services/search.service';

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private searchService: SearchService) {}

  // Method to handle search input
  onSearchInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement; // Cast to HTMLInputElement
    this.searchService.updateSearchTerm(inputElement.value);
  }
}
