import { Component } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-tutorials',
  templateUrl: './tutorials.component.html',
  styleUrl: './tutorials.component.scss',
  standalone: true,
  imports: [MarkdownModule]
})
export class TutorialsComponent {
  markdownContent = `
  # Welcome to the Tutorial!
  
  This is a sample tutorial content written in Markdown.
  
  ## Getting Started
  
  - Step 1: Install dependencies
  - Step 2: Configure your app
  - Step 3: Run and test
  
  **Happy coding!**
  `;
}
