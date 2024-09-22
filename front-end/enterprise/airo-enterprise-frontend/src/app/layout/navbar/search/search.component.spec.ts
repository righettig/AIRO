import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { SearchComponent } from './search.component';
import { SearchService } from '../../../services/search.service';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let searchServiceMock: jasmine.SpyObj<SearchService>;

  const searchTerm = 'test search';
  const searchButtonSelector = '#search-btn';
  const clearButtonSelector = '#clear-search-btn';

  beforeEach(async () => {
    searchServiceMock = jasmine.createSpyObj('SearchService', ['updateSearchTerm', 'clearSearchTerm']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, MatButtonModule, MatInputModule, NoopAnimationsModule, SearchComponent],
      providers: [{ provide: SearchService, useValue: searchServiceMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('onSearch', () => {
    it('should call searchService.updateSearchTerm with the search term', () => {
      component.searchTerm = searchTerm;
      component.onSearch();
      expect(searchServiceMock.updateSearchTerm).toHaveBeenCalledWith(searchTerm);
    });

    it('should trigger onSearch() when the search button is clicked', () => {
      spyOn(component, 'onSearch');
      clickButton(searchButtonSelector);
      expect(component.onSearch).toHaveBeenCalled();
    });
  });

  describe('clearSearch', () => {
    beforeEach(() => {
      component.searchTerm = searchTerm;
      fixture.detectChanges();
    });

    it('should clear the search term and call searchService.clearSearchTerm', () => {
      component.clearSearch();
      expect(component.searchTerm).toBe('');
      expect(searchServiceMock.clearSearchTerm).toHaveBeenCalled();
    });

    it('should trigger clearSearch() when the clear button is clicked', () => {
      spyOn(component, 'clearSearch');
      clickButton(clearButtonSelector);
      expect(component.clearSearch).toHaveBeenCalled();
    });

    it('should not display the clear button if searchTerm is empty', () => {
      component.searchTerm = '';
      fixture.detectChanges();
      expectButtonToBeAbsent(clearButtonSelector);
    });

    it('should display the clear button if searchTerm is not empty', () => {
      expectButtonToBePresent(clearButtonSelector);
    });
  });

  function clickButton(selector: string): void {
    const button: DebugElement = fixture.debugElement.query(By.css(selector));
    button.triggerEventHandler('click', null);
  }

  function expectButtonToBeAbsent(selector: string): void {
    const button: DebugElement = fixture.debugElement.query(By.css(selector));
    expect(button).toBeNull();
  }

  function expectButtonToBePresent(selector: string): void {
    const button: DebugElement = fixture.debugElement.query(By.css(selector));
    expect(button).not.toBeNull();
  }
});
