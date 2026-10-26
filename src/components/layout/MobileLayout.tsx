import { useState } from 'react';
import { useDiscourse } from '../../hooks/useDiscourse';

export default function MobileLayout() {
  const { mode, toggleMode, isAwaaz, charLimit, displayedPosts, addPost, likePost } = useDiscourse();
  const [activeNav, setActiveNav] = useState<'feed' | 'adda' | 'activity' | 'profile'>('feed');
  const [postText, setPostText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPingOpen, setIsPingOpen] = useState(false);

  const handlePublish = () => {
    addPost(postText);
    setPostText('');
    setIsModalOpen(false);
  };

  return (
    <div style={{ minHeight: '100vh', padding: '0 16px 80px', maxWidth: 600, margin: '0 auto' }}>
      <header className="feed-top-header">
        <div className="brand-wrapper">
          <div className="brand-badge">S</div>
          <div>
            <span className="brand-title">Setu</span>
            <span className="brand-sub">. {isAwaaz ? 'Awaaz' : 'Vistar'}</span>
          </div>
        </div>

        <button className="mode-toggle-btn" onClick={toggleMode}>
          <span>⇄</span>
          <span>{isAwaaz ? 'Awaaz' : 'Vistar'}</span>
        </button>

        <button className="top-ping-btn" onClick={() => setIsPingOpen(!isPingOpen)}>
          <span>⚡</span>
        </button>
      </header>

      {activeNav === 'feed' && (
        <>
          <section className="section-header">
            <span className="category-tag">{isAwaaz ? 'Micro Discourse' : 'Long-form Essays'}</span>
            <h1 className="main-title">
              {isAwaaz ? 'Awaaz' : 'Vistar'}{' '}
              <span className="hindi-title">{isAwaaz ? 'आवाज़' : 'विस्तार'}</span>
            </h1>
            <p className="subtitle">
              {isAwaaz ? 'Ideas deserve a place to be heard.' : 'Unabridged essays and deep commentary.'}
            </p>
          </section>

          <div className="feed-container">
            {displayedPosts.map((post) => (
              <article key={post.id} className="post-card">
                <div className="post-card-header">
                  <div className="post-avatar">{post.author.charAt(0)}</div>
                  <div className="post-meta">
                    <span className="post-author">{post.author}</span>
                    <span className="post-handle">{post.handle} · {post.timestamp}</span>
                    <span className="post-id-badge">{post.postIdCode}</span>
                  </div>
                </div>
                <p className="post-content" style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
                <div className="post-actions">
                  <button className="action-btn-silhouette" onClick={() => likePost(post.id)}>
                    <span>♡</span> {post.likes}
                  </button>
                  <button className="action-btn-silhouette"><span>↻</span> {post.reposts}</button>
                  <button className="action-btn-silhouette"><span>💬</span> {post.replies}</button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {activeNav === 'adda' && (
        <section className="section-header">
          <span className="category-tag">Public Commons</span>
          <h1 className="main-title">Adda <span className="hindi-title">अड्डा</span></h1>
          <p className="subtitle">Asynchronous circles and topical rooms.</p>
        </section>
      )}

      {activeNav === 'activity' && (
        <section className="section-header">
          <span className="category-tag">Notifications</span>
          <h1 className="main-title">Activity</h1>
          <p className="subtitle">Mentions, likes, and interactions on your discourse.</p>
        </section>
      )}

      {activeNav === 'profile' && (
        <section className="section-header">
          <span className="category-tag">Identity</span>
          <h1 className="main-title">Profile</h1>
          <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="post-avatar" style={{ width: 50, height: 50, fontSize: 18 }}>P</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>Parth Jadhav</div>
              <div style={{ color: 'var(--text-dim)', fontSize: 13 }}>@parth</div>
            </div>
          </div>
        </section>
      )}

      <button className="fab-silhouette" onClick={() => setIsModalOpen(true)}>
        +
      </button>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ fontWeight: 600, fontSize: 15 }}>
                New {isAwaaz ? 'Awaaz' : 'Vistar Entry'}
              </span>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 18, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            <textarea
              className="composer-textarea"
              rows={isAwaaz ? 4 : 8}
              autoFocus
              placeholder={isAwaaz ? "What's on your mind?..." : 'Draft your essay...'}
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              maxLength={charLimit}
            />
            <div className="composer-footer">
              <span className="char-counter">{postText.length}/{charLimit}</span>
              <button
                className="btn-silhouette"
                onClick={handlePublish}
                disabled={!postText.trim()}
              >
                Publish ↗
              </button>
            </div>
          </div>
        </div>
      )}

      {isPingOpen && (
        <div className="ping-overlay" onClick={() => setIsPingOpen(false)}>
          <div className="ping-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ping-header">
              <span style={{ fontWeight: 700, fontSize: 15 }}>Direct Pings</span>
              <button className="close-btn-silhouette" onClick={() => setIsPingOpen(false)}>✕</button>
            </div>
            <p style={{ color: 'var(--text-dim)', fontSize: 13, marginTop: 12 }}>No new pings.</p>
          </div>
        </div>
      )}

      <nav className="mobile-bottom-nav">
        <button
          className={`nav-item-silhouette ${activeNav === 'feed' ? 'active' : ''}`}
          onClick={() => setActiveNav('feed')}
        >
          <span>◈</span>
          <span>Discourse</span>
        </button>
        <button
          className={`nav-item-silhouette ${activeNav === 'adda' ? 'active' : ''}`}
          onClick={() => setActiveNav('adda')}
        >
          <span>◇</span>
          <span>Adda</span>
        </button>
        <button
          className={`nav-item-silhouette ${activeNav === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveNav('activity')}
        >
          <span>○</span>
          <span>Alerts</span>
        </button>
        <button
          className={`nav-item-silhouette ${activeNav === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveNav('profile')}
        >
          <span>△</span>
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
}
