import { Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { SetVideoQuality, VideoSettingsState } from '../../store/video-settings.state';
import { AsyncPipe, NgClass, NgForOf } from '@angular/common';
import { Quality } from '../../interfaces/quality.enum';

@Component({
  selector: 'app-video-quality-selector',
  imports: [
    NgForOf,
    NgClass,
    AsyncPipe
  ],
  templateUrl: './video-quality-selector.component.html',
  standalone: true,
  styleUrl: './video-quality-selector.component.scss'
})
export class VideoQualitySelectorComponent {
  private store = inject(Store);
  quality$ = this.store.select(VideoSettingsState.quality);

  qualityOptions: Array<{label: string, value: Quality}> = [
    {label: 'Low (360p)', value: Quality.LOW},
    {label: 'Medium (720p)', value: Quality.MEDIUM},
    {label: 'High (1080p)', value: Quality.HIGH},
  ];

  setQuality(quality: Quality) {
    this.store.dispatch(new SetVideoQuality(quality));
  }
}
