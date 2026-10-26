import type { VistaarFormat, VistaarItem } from '../../hooks/useDiscourse';

interface Props {
  items: VistaarItem[];
  currentTab: VistaarFormat;
  onTabChange: (tab: VistaarFormat) => void;
  onLike?: (id: string) => void;
}

export default function VistaarView({ items, currentTab, onTabChange, onLike }: Props) {
  const filtered = items.filter((i) => i.format === currentTab);

  return (
    <div className="vistaar-container">
      {/* Vistaar Sub-Navigation Tabs */}
      <div className="vistaar-subnav">
        <button
          className={`vistaar-pill ${currentTab === 'shorts' ? 'active' : ''}`}
          onClick={() => onTabChange('shorts')}
        >
          📱 Shorts
        </button>
        <button
          className={`vistaar-pill ${currentTab === 'videos' ? 'active' : ''}`}
          onClick={() => onTabChange('videos')}
        >
          🎬 Videos
        </button>
        <button
          className={`vistaar-pill ${currentTab === 'photos' ? 'active' : ''}`}
          onClick={() => onTabChange('photos')}
        >
          📷 Photos
        </button>
      </div>

      {/* 1. Shorts View (Vertical 9:16) */}
      {currentTab === 'shorts' && (
        <div className="shorts-feed">
          {filtered.map((item) => (
            <div key={item.id} className="short-card">
              <img src={item.mediaUrl} alt={item.title} className="short-media" />
              <div className="short-overlay">
                <div className="short-creator-info">
                  <span className="creator-name">{item.creator}</span>
                  <span className="creator-handle">{item.handle}</span>
                  <p className="short-caption">{item.caption}</p>
                </div>
                <div className="short-side-actions">
                  <button
                    className="short-action-btn"
                    onClick={() => onLike && onLike(item.id)}
                    style={{ color: item.liked ? '#f43f5e' : '#fff' }}
                  >
                    <span>{item.liked ? '♥' : '♡'}</span>
                    <small>{item.likes}</small>
                  </button>
                  <button className="short-action-btn">
                    <span>💬</span>
                    <small>{item.comments}</small>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. Long-Form Videos View (16:9 Cinematic) */}
      {currentTab === 'videos' && (
        <div className="videos-feed">
          {filtered.map((item) => (
            <div key={item.id} className="video-card">
              <div className="video-thumbnail-wrapper">
                <img src={item.thumbnailUrl || item.mediaUrl} alt={item.title} className="video-thumb" />
                <span className="video-play-badge">▶ Watch</span>
              </div>
              <div className="video-info">
                <h3 className="video-title">{item.title}</h3>
                <div className="video-meta">
                  <span>{item.creator} ({item.handle})</span>
                  <span>·</span>
                  <span>{item.views.toLocaleString()} views</span>
                </div>
                <p className="video-caption">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Photos View (Galleries) */}
      {currentTab === 'photos' && (
        <div className="photos-feed">
          {filtered.map((item) => (
            <div key={item.id} className="photo-card">
              <img src={item.mediaUrl} alt={item.title} className="photo-image" />
              <div className="photo-footer">
                <div className="photo-meta">
                  <strong>{item.creator}</strong> {item.caption}
                </div>
                <div className="post-actions" style={{ marginTop: 8 }}>
                  <button
                    className="action-btn-silhouette"
                    onClick={() => onLike && onLike(item.id)}
                    style={{ color: item.liked ? '#f43f5e' : 'inherit' }}
                  >
                    <span>{item.liked ? '♥' : '♡'}</span> {item.likes}
                  </button>
                  <button className="action-btn-silhouette">💬 {item.comments}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}