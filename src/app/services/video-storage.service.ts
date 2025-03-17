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

  async saveVideo(blob: Blob, duration: number): Promise<number> {
    const db = await this.dbPromise;

    const now = new Date();
    const date = now.toLocaleDateString('de-DE'); // format: 31.01.2025
    const time = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }); // format: 13:30

    const id = Date.now();
    await db.put('videos', { id, blob, date, time, duration });
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
