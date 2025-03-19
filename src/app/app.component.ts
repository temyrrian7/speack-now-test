import { Component } from '@angular/core';
import { RootComponentComponent } from './components/root-component/root-component.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [
    RootComponentComponent,
  ]
})
export class AppComponent {
}
