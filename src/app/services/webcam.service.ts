import { Injectable } from '@angular/core';
import { Quality } from '../interfaces/quality.enum';

@Injectable({ providedIn: 'root' })
export class WebcamService {
  private mediaRecorder?: MediaRecorder;
  private chunks: Blob[] = [];

  async startRecording(videoQuality: Quality): Promise<void> {
    const constraints: MediaStreamConstraints = {
      video: {
        width: videoQuality === 'low' ? 640 : videoQuality === 'medium' ? 1280 : 1920,
        height: videoQuality === 'low' ? 360 : videoQuality === 'medium' ? 720 : 1080,
      },
      audio: true
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    this.mediaRecorder = new MediaRecorder(stream);

    this.mediaRecorder.ondataavailable = (event) => {
      this.chunks.push(event.data);
    };

    this.mediaRecorder.start();
  }

  stopRecording(): Promise<Blob> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder) {
        throw new Error('Recorder not initialized.');
      }

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.chunks, { type: 'video/webm' });
        this.chunks = [];
        resolve(blob);
      };

      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    });
  }
}
