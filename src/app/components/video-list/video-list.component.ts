import { Component, inject, OnInit } from '@angular/core';
import { VideoStorageService } from '../../services/video-storage.service';
import { NgForOf, NgOptimizedImage } from '@angular/common';
import { RecordedVideo } from '../../interfaces/video.interface';
import { ModalService } from '../../services/modal.service';
import { VideoModalComponent } from '../modal-container/modal-container.component';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrl: './video-list.component.scss',
  imports: [
    NgForOf,
    NgOptimizedImage,
  ],
  standalone: true
})
export class VideoListComponent implements OnInit {
  videos: Array<RecordedVideo> = [];

  private videoStorage = inject(VideoStorageService);
  private modalService = inject(ModalService);

  ngOnInit() {
    this.loadVideos();
  }

  async loadVideos() {
    this.videos = await this.videoStorage.getVideos();
  }

  getVideoUrl(blob: Blob): string {
    return URL.createObjectURL(blob);
  }

  async deleteVideo(id: number) {
    await this.videoStorage.deleteVideo(id);
    this.videos = this.videos.filter(video => video.id !== id);
  }


  openModal(video: RecordedVideo) {
      const videoUrl = URL.createObjectURL(video.blob);
      this.modalService.open(VideoModalComponent, { videoSrc: videoUrl });
    }
}
