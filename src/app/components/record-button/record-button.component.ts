import { Component, EventEmitter, Output } from '@angular/core';
import { NgClass, NgIf, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-record-button',
  standalone: true,
  templateUrl: './record-button.component.html',
  imports: [
    NgClass,
    NgIf,
    NgOptimizedImage
  ],
  styleUrls: ['./record-button.component.scss']
})
export class RecordButtonComponent {
  @Output() recordingStarted = new EventEmitter<void>();
  @Output() recordingStopped = new EventEmitter<void>();

  isRecording = false;
  elapsedTime = 0;
  progress = 0;
  private intervalId: any;

  toggleRecording() {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }

  startRecording() {
    this.isRecording = true;
    this.elapsedTime = 0;
    this.progress = 0;
    this.recordingStarted.emit();

    this.intervalId = setInterval(() => {
      this.elapsedTime += 0.1;
      this.progress = (this.elapsedTime / 10) * 100; // 10s max
      if (this.elapsedTime >= 10) this.stopRecording();
    }, 100);
  }

  stopRecording() {
    this.isRecording = false;
    clearInterval(this.intervalId);
    this.recordingStopped.emit();
  }
}
