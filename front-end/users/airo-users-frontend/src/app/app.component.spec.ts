import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Component } from '@angular/core';
import { LayoutComponent } from './layout/layout.component';

@Component({standalone: true, selector: "app-layout"})
class MockLayoutComponent {
}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, MockLayoutComponent],
    })
    .overrideComponent(AppComponent, {
      remove: { imports: [ LayoutComponent] },
      add: { imports: [ MockLayoutComponent ] }
    })
    .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'AIRO Consumer Website' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('AIRO Consumer Website');
  });
});
