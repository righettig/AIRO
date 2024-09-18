import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatInputModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  searchTerm: string = '';

  constructor(private searchService: SearchService) {}

  onSearch(): void {
    this.searchService.updateSearchTerm(this.searchTerm);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchService.clearSearchTerm();
  }
}
