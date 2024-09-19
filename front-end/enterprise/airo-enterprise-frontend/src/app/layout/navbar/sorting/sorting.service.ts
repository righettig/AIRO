import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type SortOption = 'nameAsc' | 'nameDesc' | 'batteryAsc' | 'batteryDesc';

@Injectable({
  providedIn: 'root',
})
export class SortingService {
  private sortOptionSubject = new BehaviorSubject<SortOption>('nameAsc');
  sortOption$ = this.sortOptionSubject.asObservable();

  updateSortOption(option: SortOption): void {
    this.sortOptionSubject.next(option);
  }
}
