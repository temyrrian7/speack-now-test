import { Component, inject, OnInit } from '@angular/core';
import { VideoStorageService } from '../../services/video-storage.service';
import { WebcamService } from '../../services/webcam.service';
import { Store } from '@ngxs/store';
import { SetVideoQuality, VideoSettingsState } from '../../store/vide-settings.state';
import { Observable, timer, firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { VideoQualitySelectorComponent } from '../video-quality-selector/video-quality-selector.component';
import { BandwidthService } from '../../services/brandwith.service';
import { VideoListComponent } from '../video-list/video-list.component';

@Component({
  selector: 'app-root-component',
  templateUrl: './root-component.component.html',
  styleUrl: './root-component.component.scss',
  imports: [CommonModule, VideoQualitySelectorComponent, VideoListComponent],
  standalone: true,
})
export class RootComponentComponent implements OnInit {
  private bandwidthService = inject(BandwidthService);
  private webcamService = inject(WebcamService);
  private videoStorage = inject(VideoStorageService);
  private store = inject(Store);

  quality$: Observable<string> = this.store.select(VideoSettingsState.quality);
  recording = false;

  ngOnInit() {
    this.bandwidthService.getBandwidth().then((speed: number) => {
      let quality: 'low' | 'medium' | 'high';

      if (speed < 2) quality = 'low';
      else if (speed <= 5) quality = 'medium';
      else quality = 'high';

      this.store.dispatch(new SetVideoQuality(quality));
    });
  }

  async startRecording() {
    const quality = await firstValueFrom(this.quality$);
    await this.webcamService.startRecording(quality as 'low' | 'medium' | 'high');
    this.recording = true;

    timer(10000).subscribe(async () => {
      if (this.recording) {
        const videoBlob = await this.webcamService.stopRecording();
        await this.videoStorage.saveVideo(videoBlob);
        this.recording = false;
        console.log('Видео автоматически остановлено и сохранено (10 секунд).');
      }
    });
  }

  async stopRecording() {
    if (this.recording) {
      const videoBlob = await this.webcamService.stopRecording();
      await this.videoStorage.saveVideo(videoBlob);
      this.recording = false;
      console.log('Видео остановлено вручную и сохранено.');
    }
  }
}
