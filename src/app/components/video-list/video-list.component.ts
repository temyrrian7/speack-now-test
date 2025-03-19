import { Component, inject, OnInit } from '@angular/core';
import { VideoStorageService } from '../../services/video-storage.service';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { RecordedVideo } from '../../interfaces/video.interface';
import { ModalService } from '../../services/modal.service';
import { VideoModalComponent } from '../modal-container/modal-container.component';
import { IconComponent } from '../icon/icon.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrl: './video-list.component.scss',
  imports: [NgForOf, IconComponent, NgIf, AsyncPipe],
  standalone: true
})
export class VideoListComponent {
  videos$: Observable<RecordedVideo[]>;

  private videoStorage = inject(VideoStorageService);
  private modalService = inject(ModalService);

  constructor() {
    this.videos$ = this.videoStorage.videos$;
  }

  async deleteVideo(id: number, event: Event) {
    event.stopPropagation();
    await this.videoStorage.deleteVideo(id);
  }

  openModal(video: RecordedVideo) {
    const videoUrl = URL.createObjectURL(video.blob);
    this.modalService.open(VideoModalComponent, { videoSrc: videoUrl });
  }
}
