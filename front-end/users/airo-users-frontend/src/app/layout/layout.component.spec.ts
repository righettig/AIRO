import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutComponent } from './layout.component';
import { provideRouter } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { Component } from '@angular/core';

@Component({standalone: true, selector: "app-navbar"})
class MockNavbarComponent {
}

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutComponent, MockNavbarComponent],
      providers: [
        provideRouter([])
      ],
    })
    .overrideComponent(LayoutComponent, {
      remove: { imports: [ NavbarComponent] },
      add: { imports: [ MockNavbarComponent ] }
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
