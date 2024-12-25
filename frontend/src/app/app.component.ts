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
    this.checkRouteForSearchBar(this.router.url);

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkRouteForSearchBar(event.urlAfterRedirects);
      }
    });
  }

  private checkRouteForSearchBar(url: string): void {
    this.showSearchBar = url === '/' || url === '/boards';
  }

  onSearchInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchService.updateSearchTerm(inputElement.value);
  }
}
