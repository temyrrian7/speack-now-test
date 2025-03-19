import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  Input,
  OnDestroy,
  signal,
  ViewChild
} from '@angular/core';
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
export class VideoModalComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  @Input() videoSrc!: string;
  @Input() duration!: number;
  isPlaying = signal(false);
  progress = signal(0);
  currentTime = signal(0);
  private readonly modalService = inject(ModalService);
  private animationFrameId?: number;

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === ' ') {
      event.preventDefault();
      this.togglePlay();
    } else if (event.key === 'Escape') {
      this.closeModal();
    }
  }

  ngAfterViewInit() {
    this.animationLoop();
  }

  togglePlay() {
    if (!this.videoPlayer) return;

    const video = this.videoPlayer.nativeElement;
    if (video.paused) {
      video.play();
      this.isPlaying.set(true);
    } else {
      video.pause();
      this.isPlaying.set(false);
    }
  }

  seekTo(event: Event) {
    if (!this.videoPlayer) return;

    const input = event.target as HTMLInputElement;
    const video = this.videoPlayer.nativeElement;
    const seekTime = (parseFloat(input.value) / 100) * this.duration;

    if (isFinite(seekTime) && this.duration > 0) {
      video.currentTime = seekTime;
      this.progress.set((seekTime / this.duration) * 100);
    }
  }

  closeModal(event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    if (this.videoPlayer) {
      const video = this.videoPlayer.nativeElement;
      video.pause();
      video.currentTime = 0;
    }

    this.isPlaying.set(false);
    this.modalService.close();
  }

  formatTime(seconds: number): string {
    if (!isFinite(seconds) || seconds < 0) return '00:00';

    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private animationLoop() {
    if (!this.videoPlayer) return;
    const video = this.videoPlayer.nativeElement;

    if (!video.paused) {
      this.currentTime.set(video.currentTime);
    }

    this.progress.set((this.currentTime() / (this.duration || 1)) * 100);

    // requestAnimationFrame for smooth progress bar updates
    this.animationFrameId = requestAnimationFrame(() => this.animationLoop());
  }
}
