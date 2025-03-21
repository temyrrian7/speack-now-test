import { Injectable } from '@angular/core';
import { IDBPDatabase, openDB } from 'idb';
import { RecordedVideo } from '../interfaces/video.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class VideoStorageService {
  private readonly dbPromise: Promise<IDBPDatabase>;
  private videosSubject = new BehaviorSubject<RecordedVideo[]>([]);
  videos$ = this.videosSubject.asObservable();

  constructor() {
    this.dbPromise = openDB('video-recorder-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('videos')) {
          db.createObjectStore('videos', {keyPath: 'id', autoIncrement: true});
        }
      },
    });

    this.loadVideos();
  }

  async generateThumbnail(blob: Blob): Promise<string> {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');

      video.src = URL.createObjectURL(blob);
      video.currentTime = 1;

      video.addEventListener('loadeddata', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context = canvas.getContext('2d');
        if (context) {
          context.drawImage(video, 0, 0, canvas.width, canvas.height);

          canvas.toBlob((thumbnailBlob) => {
            URL.revokeObjectURL(video.src);

            if (thumbnailBlob) {
              const reader = new FileReader();
              reader.readAsDataURL(thumbnailBlob);
              reader.onloadend = () => resolve(reader.result as string);
            } else {
              console.error('Failed to generate thumbnail blob');
              resolve('');
            }
          }, 'image/jpeg');
        } else {
          console.error('Canvas context is null');
          resolve(''); // fallback
        }
      });

      video.addEventListener('error', (err) => {
        console.error('Error loading video for thumbnail:', err);
        resolve(''); // fallback
      });
    });
  }

  async saveVideo(blob: Blob, duration: number): Promise<number> {
    const db = await this.dbPromise;

    const now = new Date();
    const date = now.toLocaleDateString('de-DE'); // format: 31.01.2025
    const time = now.toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'}); // format: 13:30
    const thumbnail = await this.generateThumbnail(blob);
    const id = Date.now();

    const newVideo: RecordedVideo = {id, blob, date, time, duration, thumbnail};
    await db.put('videos', newVideo);

    const updatedVideos = [...this.videosSubject.value, newVideo];
    this.videosSubject.next(updatedVideos);

    return id;
  }

  async deleteVideo(id: number): Promise<void> {
    const db = await this.dbPromise;
    await db.delete('videos', id);

    const updatedVideos = this.videosSubject.value.filter(video => video.id !== id);
    this.videosSubject.next(updatedVideos);
  }

  private async loadVideos() {
    const db = await this.dbPromise;
    const videos = await db.getAll('videos');
    this.videosSubject.next(videos);
  }
}
