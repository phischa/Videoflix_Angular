// ============================================
// VIDEO MODELS
// ============================================

export type VideoCategory =
    | 'action'
    | 'drama'
    | 'comedy'
    | 'romance'
    | 'thriller'
    | 'documentary'
    | 'animation';

export interface Video {
    id: number;
    title: string;
    description: string;
    category: VideoCategory;
    thumbnail_url: string | null;
    created_at: string; // ISO date string from backend
}

export interface VideoCategoryGroup {
    name: string;
    displayName: string;
    videos: Video[];
}

// ============================================
// HLS STREAMING MODELS
// ============================================

export type HLSResolution = '360p' | '480p' | '720p' | '1080p';

export interface HLSQuality {
    resolution: HLSResolution;
    label: string;
    url: string;
}

export interface VideoPlayerState {
    videoId: number;
    currentQuality: HLSResolution;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
}