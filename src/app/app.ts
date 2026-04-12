import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormExample } from './components/form-example/form-example';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormExample],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('learning-formly');
}
