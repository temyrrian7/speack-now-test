import { Component, ElementRef, HostListener, inject, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-video-modal',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './video-modal.component.html',
  styleUrl: './video-modal.component.scss'
})
export class VideoModalComponent {
  private readonly modalService = inject(ModalService);

  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  @Input() videoSrc!: string;

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === ' ') {
      event.preventDefault();
      this.togglePlay();
    } else if (event.key === 'Escape') {
      this.closeModal();
    }
  }

  isPlaying = false;
  progress = 0;
  currentTime = 0;
  duration = 0;

  togglePlay() {
    const video = this.videoPlayer.nativeElement;
    if (video.paused) {
      video.play();
      this.isPlaying = true;
    } else {
      video.pause();
      this.isPlaying = false;
    }
  }

  updateProgress() {
    const video = this.videoPlayer.nativeElement;
    this.currentTime = video.currentTime;
    this.progress = (video.currentTime / (video.duration || 1)) * 100; // Предотвращает деление на 0
  }

  updateDuration() {
    const video = this.videoPlayer.nativeElement;

    if (video.readyState >= 2) { // READY_STATE = HAVE_CURRENT_DATA
      this.duration = isFinite(video.duration) ? video.duration : 0;
    } else {
      video.addEventListener('loadeddata', () => {
        this.duration = isFinite(video.duration) ? video.duration : 0;
      });
    }
  }

  seekTo(event: Event) {
    const input = event.target as HTMLInputElement;
    const video = this.videoPlayer.nativeElement;
    video.currentTime = (parseFloat(input.value) / 100) * (video.duration || 1);
  }

  closeModal(event?: Event) {
    if (event) event.stopPropagation();

    this.isPlaying = false;
    this.videoPlayer.nativeElement.pause();

    this.videoPlayer.nativeElement.currentTime = 0;
    this.modalService.close();
  }

  formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '00:00';

    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}
