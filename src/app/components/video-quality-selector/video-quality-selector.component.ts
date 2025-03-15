import { Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { SetVideoQuality, VideoSettingsState } from '../../store/vide-settings.state';
import { AsyncPipe, NgClass, NgForOf } from '@angular/common';

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

  qualityOptions: Array<{label: string, value: 'low' | 'medium' | 'high'}> = [
    {label: 'Low (360p)', value: 'low'},
    {label: 'Medium (720p)', value: 'medium'},
    {label: 'High (1080p)', value: 'high'},
  ];

  setQuality(quality: 'low' | 'medium' | 'high') {
    this.store.dispatch(new SetVideoQuality(quality));
  }
}
