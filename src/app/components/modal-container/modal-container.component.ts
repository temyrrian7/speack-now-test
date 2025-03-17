import { Component, inject, Input } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay">
      <div class="modal-content">
        <video [src]="videoSrc" controls autoplay></video>
        <button class="close-btn" (click)="close()">×</button>
      </div>
    </div>
  `,
  styles: [`

    :host {
      display: block;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0.6);
      z-index: 1000;

      .modal-content {
        position: relative;
        background: white;
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);

        video {
          width: 100%;
          max-width: 600px;
          border-radius: 8px;
        }

        .close-btn {
          position: absolute;
          top: 8px;
          right: 12px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #555;
        }
      }
    }
  `]
})
export class VideoModalComponent {
  videoSrc!: string;

  private modalService = inject(ModalService);

  close() {
    this.modalService.close();
  }
}
