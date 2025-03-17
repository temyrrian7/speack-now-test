import { Component, inject, OnInit } from '@angular/core';
import { VideoStorageService } from '../../services/video-storage.service';
import { NgForOf } from '@angular/common';
import { RecordedVideo } from '../../interfaces/video.interface';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrl: './video-list.component.scss',
  imports: [
    NgForOf
  ],
  standalone: true
})
export class VideoListComponent implements OnInit {
  videos: Array<RecordedVideo> = [];

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
