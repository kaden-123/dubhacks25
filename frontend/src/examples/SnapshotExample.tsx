import React, { useState } from 'react';
import { LiveCameraView } from '../components/LiveCameraView';
import { useSnapshotCapture } from '../hooks/useSnapshotCapture';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

/**
 * Example component showing how to use the snapshot functionality
 */
export function SnapshotExample() {
  const [lastSnapshot, setLastSnapshot] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any[]>([]);

  const {
    captureSnapshot,
    processQueue,
    queueStatus,
    clearQueue,
    isCapturing,
    startAutoCapture,
    stopAutoCapture
  } = useSnapshotCapture({
    autoCapture: false, // Manual control
    captureInterval: 1000,
    maxQueueSize: 10,
    apiEndpoint: 'http://localhost:8000/api/analyze-pose',
    onSnapshotProcessed: (result) => {
      console.log('Analysis result:', result);
      setAnalysisResults(prev => [...prev, result]);
    },
    onError: (error) => {
      console.error('Snapshot error:', error);
    }
  });

  const handleSnapshot = (frameBase64: string) => {
    captureSnapshot(frameBase64, {
      // Add any additional metadata
      poseSimilarity: Math.random(), // Mock data
      motionSimilarity: Math.random(), // Mock data
    });
    setLastSnapshot(frameBase64);
  };

  const handleProcessQueue = async () => {
    try {
      await processQueue();
      console.log('Queue processed successfully');
    } catch (error) {
      console.error('Failed to process queue:', error);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Snapshot Capture Example</h1>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Camera View */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Camera Feed</h2>
          <LiveCameraView 
            className="aspect-video"
            showMirrorButton={true}
            onSnapshot={handleSnapshot}
            autoSnapshot={isCapturing}
            snapshotInterval={1000}
          />
        </Card>

        {/* Controls */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Controls</h2>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button 
                onClick={startAutoCapture}
                disabled={isCapturing}
                variant="outline"
              >
                Start Auto Capture
              </Button>
              <Button 
                onClick={stopAutoCapture}
                disabled={!isCapturing}
                variant="outline"
              >
                Stop Auto Capture
              </Button>
            </div>

            <Button 
              onClick={handleProcessQueue}
              disabled={queueStatus.size === 0 || queueStatus.isProcessing}
              className="w-full"
            >
              {queueStatus.isProcessing ? 'Processing...' : `Process Queue (${queueStatus.size})`}
            </Button>

            <Button 
              onClick={clearQueue}
              disabled={queueStatus.size === 0}
              variant="destructive"
              className="w-full"
            >
              Clear Queue
            </Button>

            <div className="text-sm text-muted-foreground">
              <p>Queue Status: {queueStatus.size} snapshots</p>
              <p>Processing: {queueStatus.isProcessing ? 'Yes' : 'No'}</p>
              <p>Auto Capture: {isCapturing ? 'Active' : 'Inactive'}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Last Snapshot Preview */}
      {lastSnapshot && (
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Last Snapshot</h2>
          <img 
            src={lastSnapshot} 
            alt="Last captured snapshot"
            className="max-w-xs rounded-lg border"
          />
        </Card>
      )}

      {/* Analysis Results */}
      {analysisResults.length > 0 && (
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Analysis Results</h2>
          <div className="space-y-2">
            {analysisResults.slice(-5).map((result, index) => (
              <div key={index} className="p-2 bg-muted rounded text-sm">
                <pre>{JSON.stringify(result, null, 2)}</pre>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
