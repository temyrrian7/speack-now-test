import { Component, inject } from '@angular/core';
import { VideoStorageService } from '../../services/video-storage.service';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrl: './video-list.component.scss',
  imports: [
    NgForOf
  ],
  standalone: true
})
export class VideoListComponent {
  videos: Array<{ id: number; blob: Blob }> = [];

  private videoStorage = inject(VideoStorageService);

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
}
