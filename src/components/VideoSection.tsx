import React, { useState } from 'react';
import { Play, Clock, BookOpen, Film } from 'lucide-react';
import type { VideoContent } from '../types';

interface VideoSectionProps {
  videos: VideoContent[];
}

const VideoSection: React.FC<VideoSectionProps> = ({ videos }) => {
  const [selectedVideo, setSelectedVideo] = useState<VideoContent | null>(null);

  const getCategoryIcon = (category: VideoContent['category']) => {
    switch (category) {
      case 'documentary': return <Film size={16} />;
      case 'lecture': return <BookOpen size={16} />;
      case 'historical': return <Clock size={16} />;
      case 'educational': return <Play size={16} />;
      default: return <Play size={16} />;
    }
  };

  const getCategoryLabel = (category: VideoContent['category']) => {
    switch (category) {
      case 'documentary': return 'Phim tài liệu';
      case 'lecture': return 'Bài giảng';
      case 'historical': return 'Lịch sử';
      case 'educational': return 'Giáo dục';
      default: return 'Video';
    }
  };

  return (
    <div className="video-section">
      <h3 className="section-title">📹 Video bài học</h3>
      
      {selectedVideo && (
        <div className="video-player-container">
          <div className="video-header">
            <h4>{selectedVideo.title}</h4>
            <button 
              className="close-video-btn"
              onClick={() => setSelectedVideo(null)}
            >
              ✕
            </button>
          </div>
          <div className="video-iframe-wrapper">
            <iframe
              width="100%"
              height="400"
              src={selectedVideo.embedUrl}
              title={selectedVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <p className="video-description">{selectedVideo.description}</p>
        </div>
      )}

      <div className="video-grid">
        {videos.map((video) => (
          <div key={video.id} className="video-card">
            <div className="video-thumbnail">
              <div className="play-overlay" onClick={() => setSelectedVideo(video)}>
                <Play size={32} />
              </div>
              <div className="video-info-overlay">
                <span className="video-duration">{video.duration}</span>
                <span className="video-category">
                  {getCategoryIcon(video.category)}
                  {getCategoryLabel(video.category)}
                </span>
              </div>
            </div>
            <div className="video-details">
              <h4>{video.title}</h4>
              <p>{video.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoSection;
