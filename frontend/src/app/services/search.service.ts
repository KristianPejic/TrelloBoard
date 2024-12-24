import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private searchTermSource = new BehaviorSubject<string>(''); // Default empty search term
  currentSearchTerm = this.searchTermSource.asObservable(); // Observable for components to subscribe to

  updateSearchTerm(term: string): void {
    this.searchTermSource.next(term); // Update search term dynamically
  }
}
