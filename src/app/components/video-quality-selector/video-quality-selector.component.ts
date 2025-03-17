import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { SetVideoQuality, VideoSettingsState } from '../../store/video-settings.state';
import { Observable } from 'rxjs';
import { Quality } from '../../interfaces/quality.enum';
import { AsyncPipe, NgClass, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-video-quality-selector',
  templateUrl: './video-quality-selector.component.html',
  styleUrls: ['./video-quality-selector.component.scss'],
  imports: [
    NgClass,
    AsyncPipe,
    NgIf,
    NgForOf,
    NgOptimizedImage
  ],
  standalone: true
})
export class VideoQualitySelectorComponent {
  quality$: Observable<string>;
  isMenuOpen = false;
  hovering = false;

  qualityOptions = [
    { value: Quality.LOW, label: '360p (Low Quality)' },
    { value: Quality.MEDIUM, label: '720p (Medium Quality)' },
    { value: Quality.HIGH, label: '1080p (High Quality)' }
  ];

  constructor(private store: Store) {
    this.quality$ = this.store.select(VideoSettingsState.quality);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  setQuality(quality: Quality) {
    this.store.dispatch(new SetVideoQuality(quality));
    this.isMenuOpen = false; // Закрываем меню после выбора
  }
}
