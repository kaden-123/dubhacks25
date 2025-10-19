/**
 * Dance API service for communicating with the backend
 */

const API_BASE_URL = 'http://localhost:8000';

export interface ProcessSnapshotResponse {
  timestamp: number;
  pose_landmarks: number[][] | null;
  hand_landmarks: number[][][];
  hand_classifications: Array<{
    label: string;
    confidence: number;
  }>;
  preprocessed_angles: Record<string, number>;
  comparison_result: {
    pose_score: number;
    motion_score: number;
    combined_score: number;
    dtw_score: number;
    best_match_index: number;
    timestamp: number;
  } | null;
  live_feedback: string | null;
  success: boolean;
  error?: string;
}

export interface StartSessionResponse {
  session_id: string;
  message: string;
}

export interface LoadReferenceRequest {
  video_name: string;
}

export interface UpdateConfigRequest {
  pose_weight?: number;
  motion_weight?: number;
  snapshot_interval?: number;
}

export interface SessionStatusResponse {
  session_id: string | null;
  start_time: number | null;
  pose_count: number;
  reference_video: string | null;
  session_duration: number;
}

export interface SessionFeedbackResponse {
  session_id: string;
  total_feedback_items: number;
  strengths: string[];
  severity_distribution: Record<string, number>;
}

class DanceAPI {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async processSnapshot(imageData: string, videoTimestamp?: number): Promise<ProcessSnapshotResponse> {
    return this.request<ProcessSnapshotResponse>('/api/sessions/snapshot', {
      method: 'POST',
      body: JSON.stringify({ 
        image: imageData,
        video_timestamp: videoTimestamp 
      }),
    });
  }

  async startSession(): Promise<StartSessionResponse> {
    return this.request<StartSessionResponse>('/api/sessions/start', {
      method: 'POST',
    });
  }

  async endSession(): Promise<StartSessionResponse> {
    return this.request<StartSessionResponse>('/api/sessions/end', {
      method: 'POST',
    });
  }

  async loadReferenceVideo(videoName: string): Promise<{ video_name: string; message: string }> {
    return this.request('/api/reference/load', {
      method: 'POST',
      body: JSON.stringify({ video_name: videoName }),
    });
  }

  async updateConfig(config: UpdateConfigRequest): Promise<any> {
    return this.request('/api/config/update', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  async getConfig(): Promise<any> {
    return this.request('/api/config');
  }

  async getSessionStatus(): Promise<SessionStatusResponse> {
    return this.request<SessionStatusResponse>('/api/sessions/status');
  }

  async testConnection(): Promise<{ status: string; message: string }> {
    return this.request('/health');
  }

  async getCurrentReference(): Promise<{ video_name: string | null }> {
    return this.request('/api/reference/current');
  }
}

export const danceAPI = new DanceAPI();