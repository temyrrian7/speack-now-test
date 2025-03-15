import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { IDBPDatabase, openDB } from 'idb';

@Injectable({ providedIn: 'root' })
export class VideoStorageService {
  private dbPromise = openDB('video-recorder-db', 1, {
    upgrade(db: IDBPDatabase<any>) {
      if (!db.objectStoreNames.contains('videos')) {
        db.createObjectStore('videos', { keyPath: 'id', autoIncrement: true });
      }
    },
  });

  async saveVideo(blob: Blob) {
    const db = await this.dbPromise;
    const id = Date.now();
    await db.put('videos', { id, blob });
    return id;
  }

  async getVideos() {
    const db = await this.dbPromise;
    return await db.getAll('videos');
  }

  async deleteVideo(id: number) {
    const db = await this.dbPromise;
    await db.delete('videos', id);
  }
}
