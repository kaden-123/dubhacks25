import { useState, useEffect, useCallback, useRef } from 'react';
import { snapshotService, SnapshotData } from '../services/snapshotService';

interface UseSnapshotCaptureOptions {
  autoCapture?: boolean;
  captureInterval?: number; // in milliseconds
  maxQueueSize?: number;
  apiEndpoint?: string;
  onSnapshotProcessed?: (result: any) => void;
  onError?: (error: Error) => void;
}

interface UseSnapshotCaptureReturn {
  captureSnapshot: (frameBase64: string, additionalData?: Partial<SnapshotData>) => void;
  processQueue: () => Promise<void>;
  queueStatus: {
    size: number;
    isProcessing: boolean;
  };
  clearQueue: () => void;
  isCapturing: boolean;
  startAutoCapture: () => void;
  stopAutoCapture: () => void;
  pauseProcessing: () => void;
  resumeProcessing: () => void;
}

export function useSnapshotCapture(options: UseSnapshotCaptureOptions = {}): UseSnapshotCaptureReturn {
  const {
    autoCapture = false,
    captureInterval = 500,
    maxQueueSize = 100,
    apiEndpoint,
    onSnapshotProcessed,
    onError
  } = options;

  const [isCapturing, setIsCapturing] = useState(false);
  const [queueStatus, setQueueStatus] = useState({ size: 0, isProcessing: false });
  const intervalRef = useRef<number | null>(null);
  const lastSnapshotTime = useRef<number>(0);

  // Set API endpoint if provided
  useEffect(() => {
    if (apiEndpoint) {
      snapshotService.setApiEndpoint(apiEndpoint);
    }
  }, [apiEndpoint]);

  // Update queue status periodically
  useEffect(() => {
    const updateStatus = () => {
      const status = snapshotService.getQueueStatus();
      setQueueStatus({
        size: status.snapshots.length,
        isProcessing: status.isProcessing
      });
    };

    const statusInterval = setInterval(updateStatus, 1000);
    return () => clearInterval(statusInterval);
  }, []);

  // Auto-capture functionality
  useEffect(() => {
    if (autoCapture && isCapturing) {
      intervalRef.current = setInterval(() => {
        // This will be called by the camera component
        // The actual capture happens in the camera component
      }, captureInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [autoCapture, isCapturing, captureInterval]);

  const captureSnapshot = useCallback((frameBase64: string, additionalData?: Partial<SnapshotData>) => {
    try {
      // Throttle snapshots to avoid overwhelming the system
      const now = Date.now();
      if (now - lastSnapshotTime.current < 100) { // Minimum 100ms between snapshots
        return;
      }
      lastSnapshotTime.current = now;

      snapshotService.addSnapshot(frameBase64, additionalData);
      
      // Update queue status
      const status = snapshotService.getQueueStatus();
      setQueueStatus({
        size: status.snapshots.length,
        isProcessing: status.isProcessing
      });

    } catch (error) {
      console.error('Error capturing snapshot:', error);
      onError?.(error as Error);
    }
  }, [onError]);

  const processQueue = useCallback(async () => {
    try {
      await snapshotService.processSnapshots();
      
      // Update queue status after processing
      const status = snapshotService.getQueueStatus();
      setQueueStatus({
        size: status.snapshots.length,
        isProcessing: status.isProcessing
      });

    } catch (error) {
      console.error('Error processing snapshot queue:', error);
      onError?.(error as Error);
    }
  }, [onError]);

  const clearQueue = useCallback(() => {
    snapshotService.clearQueue();
    setQueueStatus({ size: 0, isProcessing: false });
  }, []);

  const startAutoCapture = useCallback(() => {
    setIsCapturing(true);
  }, []);

  const stopAutoCapture = useCallback(() => {
    setIsCapturing(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const pauseProcessing = useCallback(() => {
    snapshotService.pauseProcessing();
  }, []);

  const resumeProcessing = useCallback(() => {
    snapshotService.resumeProcessing();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    captureSnapshot,
    processQueue,
    queueStatus,
    clearQueue,
    isCapturing,
    startAutoCapture,
    stopAutoCapture,
    pauseProcessing,
    resumeProcessing
  };
}
