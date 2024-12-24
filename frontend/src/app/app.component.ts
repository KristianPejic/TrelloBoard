import { Component, OnInit } from '@angular/core';
import { SearchService } from './services/search.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  showSearchBar: boolean = false; // Default to hidden
  title = 'Trello Board';

  constructor(private searchService: SearchService, private router: Router) {}

  ngOnInit(): void {
    // Check the current route on load
    this.checkRouteForSearchBar(this.router.url);

    // Listen for navigation events to update search bar visibility dynamically
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkRouteForSearchBar(event.urlAfterRedirects);
      }
    });
  }

  private checkRouteForSearchBar(url: string): void {
    // Show the search bar only on '/' or '/boards'
    this.showSearchBar = url === '/' || url === '/boards';
  }

  onSearchInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchService.updateSearchTerm(inputElement.value);
  }
}
