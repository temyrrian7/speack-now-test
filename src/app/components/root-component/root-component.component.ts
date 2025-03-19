import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { VideoStorageService } from '../../services/video-storage.service';
import { WebcamService } from '../../services/webcam.service';
import { Store } from '@ngxs/store';
import { SetVideoQuality, VideoSettingsState } from '../../store/video-settings.state';
import { firstValueFrom, Observable, timer } from 'rxjs';
import { CommonModule } from '@angular/common';
import { VideoQualitySelectorComponent } from '../video-quality-selector/video-quality-selector.component';
import { BandwidthService } from '../../services/brandwith.service';
import { VideoListComponent } from '../video-list/video-list.component';
import { Quality } from '../../interfaces/quality.enum';
import { RecordButtonComponent } from '../record-button/record-button.component';

@Component({
  selector: 'app-root-component',
  templateUrl: './root-component.component.html',
  styleUrl: './root-component.component.scss',
  imports: [CommonModule, VideoQualitySelectorComponent, VideoListComponent, RecordButtonComponent],
  standalone: true,
})
export class RootComponentComponent implements OnInit {
  @ViewChild('recordingVideo') recordingVideo!: ElementRef<HTMLVideoElement>;
  recording = false;
  recordStartTime = 0;
  private bandwidthService = inject(BandwidthService);
  private webcamService = inject(WebcamService);
  private videoStorage = inject(VideoStorageService);
  private store = inject(Store);
  quality$: Observable<Quality> = this.store.select(VideoSettingsState.quality);

  private mediaStream!: MediaStream;

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
    this.recordStartTime = Date.now();

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
      this.recordingVideo.nativeElement.srcObject = this.mediaStream;
      await this.recordingVideo.nativeElement.play();
    } catch (error) {
      alert("Ошибка доступа к камере:" + error);
      return;
    }

    timer(10000).subscribe(async () => {
      if (this.recording) {
        await this.stopRecording();
      }
    });
  }

  async stopRecording() {
    if (this.recording) {
      const videoBlob = await this.webcamService.stopRecording();
      const duration = Math.floor((Date.now() - this.recordStartTime) / 1000);

      await this.videoStorage.saveVideo(videoBlob, duration);
      this.recording = false;

      if (this.mediaStream) {
        this.mediaStream.getTracks().forEach(track => track.stop());
      }

      if (this.recordingVideo?.nativeElement) {
        this.recordingVideo.nativeElement.srcObject = null;
      }
    }
  }
}
