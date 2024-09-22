import { Component } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { SortingService, SortOption } from './sorting.service';

@Component({
  selector: 'app-sorting',
  standalone: true,
  imports: [MatSelectModule, MatOptionModule],
  templateUrl: './sorting.component.html',
  styleUrl: './sorting.component.scss',
})
export class SortingComponent {
  sortOption: SortOption = 'nameAsc';

  constructor(private sortingService: SortingService) {}

  onSortOptionChange(value: SortOption): void {
    this.sortOption = value;
    this.sortingService.updateSortOption(value);
  }
}
