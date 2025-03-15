import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BandwidthService {
  async getBandwidth(): Promise<number> {
    return new Promise((resolve) => {
      const startTime = performance.now();
      const image = new Image();
      const testImageUrl = 'https://via.assets.so/img.jpg';

      image.onload = () => {
        const endTime = performance.now();
        const duration = (endTime - startTime) / 1000;
        const fileSizeInBits = 8 * 500000;
        const speedMbps = fileSizeInBits / duration / 1_000_000;
        console.log(speedMbps);
        resolve(speedMbps);
      };

      image.onerror = () => resolve(3);
      image.src = `${testImageUrl}?t=${Date.now()}`;
    });
  }
}
