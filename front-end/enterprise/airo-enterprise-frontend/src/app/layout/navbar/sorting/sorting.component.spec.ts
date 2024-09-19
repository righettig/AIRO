import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { SortingComponent } from './sorting.component';
import { SortingService, SortOption } from '../../../services/sorting.service';
import { MatOptionModule } from '@angular/material/core';

describe('SortingComponent', () => {
  let component: SortingComponent;
  let fixture: ComponentFixture<SortingComponent>;
  let mockSortingService: jasmine.SpyObj<SortingService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('SortingService', ['updateSortOption']);

    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, MatSelectModule, MatOptionModule, SortingComponent],
      providers: [{ provide: SortingService, useValue: spy }]
    }).compileComponents();

    mockSortingService = TestBed.inject(SortingService) as jasmine.SpyObj<SortingService>;

    fixture = TestBed.createComponent(SortingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call updateSortOption on sortingService when sort option changes', () => {
    const sortOption: SortOption = 'batteryDesc';

    component.onSortOptionChange(sortOption);

    expect(component.sortOption).toBe(sortOption);
    expect(mockSortingService.updateSortOption).toHaveBeenCalledWith(sortOption);
  });
});
