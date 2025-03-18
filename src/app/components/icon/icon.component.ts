import { Component, Input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-icon',
  standalone: true,
  templateUrl: './icon.component.html',
  imports: [
    NgOptimizedImage
  ],
  styleUrls: ['./icon.component.scss']
})
export class IconComponent {
  @Input() name!: string;
  @Input() size: number = 24;
}
