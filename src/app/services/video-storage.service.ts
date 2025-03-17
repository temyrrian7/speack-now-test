import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';
import { RecordedVideo } from '../interfaces/video.interface';

@Injectable({ providedIn: 'root' })
export class VideoStorageService {
  private dbPromise: Promise<IDBPDatabase>;

  constructor() {
    this.dbPromise = openDB('video-recorder-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('videos')) {
          db.createObjectStore('videos', { keyPath: 'id', autoIncrement: true });
        }
      },
    });
  }

  async generateThumbnail(blob: Blob): Promise<string> {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');

      video.src = URL.createObjectURL(blob);
      video.currentTime = 0.5; // Берём кадр на 0.5 секунде

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
              resolve(''); // fallback: возвращаем пустую строку
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
    const time = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }); // format: 13:30
    const thumbnail = await this.generateThumbnail(blob);
    const id = Date.now();

    await db.put('videos', { id, blob, date, time, duration, thumbnail });
    return id;
  }

  async getVideos(): Promise<RecordedVideo[]> {
    const db = await this.dbPromise;
    return await db.getAll('videos');
  }

  async deleteVideo(id: number): Promise<void> {
    const db = await this.dbPromise;
    await db.delete('videos', id);
  }
}
