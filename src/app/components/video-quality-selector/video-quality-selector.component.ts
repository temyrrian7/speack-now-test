import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { SetVideoQuality, VideoSettingsState } from '../../store/video-settings.state';
import { Observable } from 'rxjs';
import { Quality } from '../../interfaces/quality.enum';
import { AsyncPipe, NgClass, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-video-quality-selector',
  templateUrl: './video-quality-selector.component.html',
  styleUrls: ['./video-quality-selector.component.scss'],
  imports: [
    NgClass,
    AsyncPipe,
    NgIf,
    NgForOf,
    NgOptimizedImage,
    IconComponent
  ],
  standalone: true
})
export class VideoQualitySelectorComponent {
  quality$: Observable<string>;
  isMenuOpen = false;

  qualityOptions = [
    { value: Quality.LOW,
      resolution: '360p',
      label: '(Low Quality)'
    },
    { value: Quality.MEDIUM,
      resolution: '720p',
      label: '(Medium Quality)'
    },
    { value: Quality.HIGH,
      resolution: '1080p',
      label: '(High Quality)'
    }
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
