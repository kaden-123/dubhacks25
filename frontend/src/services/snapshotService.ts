// Snapshot Service for handling camera snapshots and API communication

export interface SnapshotData {
  timestamp: number;
  frameBase64: string;
  poseSimilarity?: number;
  motionSimilarity?: number;
  combinedScore?: number;
  errors?: Array<{
    joint: string;
    error: string;
    severity: 'low' | 'medium' | 'high';
  }>;
  bestMatchIdx?: number;
  referenceTimestamp?: number;
  timingOffset?: number;
}

export interface SnapshotQueue {
  snapshots: SnapshotData[];
  maxSize: number;
  isProcessing: boolean;
  isPaused: boolean;
}

class SnapshotService {
  private queue: SnapshotQueue = {
    snapshots: [],
    maxSize: 100, // Keep last 100 snapshots
    isProcessing: false,
    isPaused: false
  };

  private apiEndpoint: string = 'http://localhost:8000/api/analyze-pose';

  /**
   * Add a snapshot to the queue
   */
  addSnapshot(frameBase64: string, additionalData?: Partial<SnapshotData>): void {
    const snapshot: SnapshotData = {
      timestamp: Date.now(),
      frameBase64,
      ...additionalData
    };

    // Add to queue
    this.queue.snapshots.push(snapshot);

    // Maintain queue size
    if (this.queue.snapshots.length > this.queue.maxSize) {
      this.queue.snapshots.shift(); // Remove oldest
    }

    console.log(`Snapshot added. Queue size: ${this.queue.snapshots.length}`);
  }

  /**
   * Process snapshots by sending to API
   */
  async processSnapshots(): Promise<void> {
    if (this.queue.isProcessing || this.queue.snapshots.length === 0 || this.queue.isPaused) {
      return;
    }

    this.queue.isProcessing = true;

    try {
      // Process snapshots in batches
      const batchSize = 5;
      const batches = this.chunkArray(this.queue.snapshots, batchSize);

      for (const batch of batches) {
        await this.sendBatchToAPI(batch);
        
        // Small delay between batches to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Clear processed snapshots
      this.queue.snapshots = [];
      console.log('All snapshots processed successfully');

    } catch (error) {
      console.error('Error processing snapshots:', error);
    } finally {
      this.queue.isProcessing = false;
    }
  }

  /**
   * Send a single snapshot to the API immediately
   */
  async sendSnapshotImmediately(snapshot: SnapshotData): Promise<any> {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          frame_base64: snapshot.frameBase64,
          timestamp: snapshot.timestamp,
          // Add any additional data needed by your backend
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('Snapshot analysis result:', result);
      return result;

    } catch (error) {
      console.error('Error sending snapshot to API:', error);
      throw error;
    }
  }

  /**
   * Send a batch of snapshots to the API
   */
  private async sendBatchToAPI(batch: SnapshotData[]): Promise<void> {
    try {
      const response = await fetch(`${this.apiEndpoint}/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          snapshots: batch.map(snapshot => ({
            frame_base64: snapshot.frameBase64,
            timestamp: snapshot.timestamp,
          }))
        }),
      });

      if (!response.ok) {
        throw new Error(`Batch API request failed: ${response.status}`);
      }

      const results = await response.json();
      console.log(`Batch of ${batch.length} snapshots processed:`, results);

    } catch (error) {
      console.error('Error sending batch to API:', error);
      throw error;
    }
  }

  /**
   * Get current queue status
   */
  getQueueStatus(): SnapshotQueue {
    return { ...this.queue };
  }

  /**
   * Clear the snapshot queue
   */
  clearQueue(): void {
    this.queue.snapshots = [];
    console.log('Snapshot queue cleared');
  }

  /**
   * Pause snapshot processing
   */
  pauseProcessing(): void {
    this.queue.isPaused = true;
    console.log('Snapshot processing paused');
  }

  /**
   * Resume snapshot processing
   */
  resumeProcessing(): void {
    this.queue.isPaused = false;
    console.log('Snapshot processing resumed');
  }

  /**
   * Set API endpoint
   */
  setApiEndpoint(endpoint: string): void {
    this.apiEndpoint = endpoint;
  }

  /**
   * Utility function to chunk array into smaller arrays
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * Convert base64 data URL to blob for file upload
   */
  dataURLToBlob(dataURL: string): Blob {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new Blob([u8arr], { type: mime });
  }

  /**
   * Upload snapshot as file (alternative to base64)
   */
  async uploadSnapshotAsFile(snapshot: SnapshotData): Promise<any> {
    try {
      const blob = this.dataURLToBlob(snapshot.frameBase64);
      const formData = new FormData();
      
      formData.append('image', blob, `snapshot_${snapshot.timestamp}.jpg`);
      formData.append('timestamp', snapshot.timestamp.toString());

      const response = await fetch(`${this.apiEndpoint}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`File upload failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('File upload result:', result);
      return result;

    } catch (error) {
      console.error('Error uploading snapshot as file:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const snapshotService = new SnapshotService();

// Export types for use in components
export type { SnapshotData, SnapshotQueue };
