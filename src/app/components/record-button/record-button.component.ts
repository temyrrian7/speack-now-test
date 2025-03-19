import { Component, EventEmitter, Output, OnDestroy } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { interval, Subscription, takeWhile, tap, finalize } from 'rxjs';

@Component({
  selector: 'app-record-button',
  standalone: true,
  templateUrl: './record-button.component.html',
  imports: [
    NgClass,
    NgIf,
    IconComponent
  ],
  styleUrls: ['./record-button.component.scss']
})
export class RecordButtonComponent implements OnDestroy {
  @Output() recordingStarted = new EventEmitter<void>();
  @Output() recordingStopped = new EventEmitter<void>();

  isRecording = false;
  progress = 0;
  elapsedTime = 0; // Добавлено для отображения времени записи
  private subscription: Subscription | null = null;

  async toggleRecording() {
    const hasAccess = await this.hasCameraAccess();
    if (!hasAccess) {
      alert("Camera access denied by user");
      return;
    }
    if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }


  async hasCameraAccess(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop()); // Останавливаем поток сразу
      return true;
    } catch (error) {
      return false; // Если ошибка, значит нет доступа
    }
  }

  startRecording() {
    this.isRecording = true;
    this.progress = 0;
    this.elapsedTime = 0;
    this.recordingStarted.emit();

    this.subscription = interval(100).pipe(
      tap(time => {
        this.elapsedTime = time / 10;
        this.progress = (this.elapsedTime / 10) * 100;
      }),
      takeWhile(time => time < 100, true),
      finalize(() => this.stopRecording())
    ).subscribe();
  }

  stopRecording() {
    this.isRecording = false;
    this.subscription?.unsubscribe();
    this.recordingStopped.emit();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe(); // Очистка при уничтожении компонента
  }
}
