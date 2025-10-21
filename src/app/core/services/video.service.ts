import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Video, VideoCategoryGroup, HLSQuality, HLSResolution } from '@core/models';
import { environment } from '@environments/environment';

@Injectable({
    providedIn: 'root'
})
export class VideoService {
    private apiService = inject(ApiService);
    private readonly apiUrl = environment.apiUrl;

    /**
     * Holt alle Videos vom Backend
     */
    getVideos(): Observable<Video[]> {
        return this.apiService.get<Video[]>('/video/');
    }

    /**
     * Gruppiert Videos nach Kategorien
     * Beispiel: [{ name: 'action', displayName: 'Action', videos: [...] }]
     */
    getVideosByCategory(): Observable<VideoCategoryGroup[]> {
        return this.getVideos().pipe(
            map(videos => {
                // Map für Kategorien erstellen
                const categoryMap = new Map<string, Video[]>();

                // Videos nach Kategorie gruppieren
                videos.forEach(video => {
                    if (!categoryMap.has(video.category)) {
                        categoryMap.set(video.category, []);
                    }
                    categoryMap.get(video.category)!.push(video);
                });

                // In Array umwandeln mit schönen Namen
                return Array.from(categoryMap.entries()).map(([name, videos]) => ({
                    name: name,
                    displayName: this.getCategoryDisplayName(name),
                    videos: videos
                }));
            })
        );
    }

    /**
     * Generiert HLS Manifest URL für Video & Qualität
     * Beispiel: http://localhost:8000/api/video/5/720p/index.m3u8
     */
    getHLSUrl(videoId: number, quality: HLSResolution = '720p'): string {
        return `${this.apiUrl}/video/${videoId}/${quality}/index.m3u8`;
    }

    /**
     * Gibt alle verfügbaren Qualitätsstufen zurück
     */
    getAvailableQualities(videoId: number): HLSQuality[] {
        return [
            {
                resolution: '360p',
                label: 'SD 360p',
                url: this.getHLSUrl(videoId, '360p')
            },
            {
                resolution: '480p',
                label: 'SD 480p',
                url: this.getHLSUrl(videoId, '480p')
            },
            {
                resolution: '720p',
                label: 'HD 720p',
                url: this.getHLSUrl(videoId, '720p')
            },
            {
                resolution: '1080p',
                label: 'Full HD 1080p',
                url: this.getHLSUrl(videoId, '1080p')
            }
        ];
    }

    /**
     * Macht aus 'action' → 'Action', 'documentary' → 'Dokumentation'
     */
    private getCategoryDisplayName(category: string): string {
        const categoryNames: { [key: string]: string } = {
            'action': 'Action',
            'drama': 'Drama',
            'comedy': 'Komödie',
            'romance': 'Romantik',
            'thriller': 'Thriller',
            'documentary': 'Dokumentation',
            'animation': 'Animation'
        };

        return categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1);
    }
}