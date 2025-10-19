import { useState, useCallback } from 'react';
import { danceAPI, ProcessSnapshotResponse } from '../services/danceAPI';

export function useDanceSession() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);

  const startDanceSession = useCallback(async () => {
    try {
      const response = await danceAPI.startSession();
      setSessionId(response.session_id);
      setIsSessionActive(true);
      console.log('Dance session started:', response.session_id);
      return response;
    } catch (error) {
      console.error('Failed to start dance session:', error);
      throw error;
    }
  }, []);

  const endDanceSession = useCallback(async () => {
    try {
      const response = await danceAPI.endSession();
      setSessionId(null);
      setIsSessionActive(false);
      console.log('Dance session ended:', response.session_id);
      return response;
    } catch (error) {
      console.error('Failed to end dance session:', error);
      throw error;
    }
  }, []);

  const processSnapshot = useCallback(async (snapshot: string): Promise<ProcessSnapshotResponse> => {
    try {
      const response = await danceAPI.processSnapshot(snapshot);
      return response;
    } catch (error) {
      console.error('Failed to process snapshot:', error);
      throw error;
    }
  }, []);

  const loadReferenceVideo = useCallback(async (videoName: string) => {
    try {
      const response = await danceAPI.loadReferenceVideo(videoName);
      console.log('Reference video loaded:', response.video_name);
      return response;
    } catch (error) {
      console.error('Failed to load reference video:', error);
      throw error;
    }
  }, []);

  const testBackendConnection = useCallback(async () => {
    try {
      const response = await danceAPI.testConnection();
      console.log('Backend connection test:', response);
      return response;
    } catch (error) {
      console.error('Backend connection failed:', error);
      throw error;
    }
  }, []);

  return {
    sessionId,
    isSessionActive,
    startDanceSession,
    endDanceSession,
    processSnapshot,
    loadReferenceVideo,
    testBackendConnection,
  };
}
