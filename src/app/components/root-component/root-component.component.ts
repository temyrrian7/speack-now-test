import { Component, inject, OnInit } from '@angular/core';
import { VideoStorageService } from '../../services/video-storage.service';
import { WebcamService } from '../../services/webcam.service';
import { Store } from '@ngxs/store';
import { SetVideoQuality, VideoSettingsState } from '../../store/video-settings.state';
import { Observable, timer, firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { VideoQualitySelectorComponent } from '../video-quality-selector/video-quality-selector.component';
import { BandwidthService } from '../../services/brandwith.service';
import { VideoListComponent } from '../video-list/video-list.component';
import { Quality } from '../../interfaces/quality.enum';

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

  quality$: Observable<Quality> = this.store.select(VideoSettingsState.quality);
  recording = false;
  recordStartTime = 0;

  ngOnInit() {
    this.bandwidthService.getBandwidth().then((speed: number) => {
      let quality: Quality;

      if (speed < 2) {
        quality = Quality.LOW;
      } else if (speed <= 5) {
        quality = Quality.MEDIUM;
      } else {
        quality = Quality.HIGH;
      }

      this.store.dispatch(new SetVideoQuality(quality));
    });
  }

  async startRecording() {
    const quality = await firstValueFrom(this.quality$);
    await this.webcamService.startRecording(quality);
    this.recording = true;

    // Сохраняем текущее время старта записи
    this.recordStartTime = Date.now();

    timer(10000).subscribe(async () => {
      console.log('timer started');
      if (this.recording) {
        const videoBlob = await this.webcamService.stopRecording();
        const duration = Math.floor((Date.now() - this.recordStartTime) / 1000);

        await this.videoStorage.saveVideo(videoBlob, duration);

        this.recording = false;
        console.log('Auto stopped and saved.');
      }
    });
  }

  async stopRecording() {
    if (this.recording) {
      const videoBlob = await this.webcamService.stopRecording();

      // вычисляем реальную длительность записи в секундах
      const duration = Math.floor((Date.now() - this.recordStartTime) / 1000);

      await this.videoStorage.saveVideo(videoBlob, duration);
      this.recording = false;

      console.log('Видео остановлено вручную и сохранено.');
    }
  }
}
