import { useState } from 'react';
import { useDiscourse } from '../../hooks/useDiscourse';

export default function DesktopLayout() {
  const { mode, toggleMode, isAwaaz, charLimit, displayedPosts, addPost, likePost } = useDiscourse();
  const [postText, setPostText] = useState('');
  const [activeNav, setActiveNav] = useState<'feed' | 'adda' | 'activity' | 'profile'>('feed');
  const [feedFilter, setFeedFilter] = useState<'latest' | 'curated'>('latest');

  const handlePublish = () => {
    addPost(postText);
    setPostText('');
  };

  return (
    <div className="app-layout">
      {/* 1. Left Sidebar Navigation */}
      <aside className="desktop-sidebar">
        <div>
          <div className="brand-wrapper" style={{ padding: '0 8px' }}>
            <div className="brand-badge">S</div>
            <div>
              <span className="brand-title">Setu</span>
              <span className="brand-sub">. Social</span>
            </div>
          </div>

          <nav className="sidebar-nav-group">
            <button
              className={`sidebar-nav-item ${activeNav === 'feed' ? 'active' : ''}`}
              onClick={() => setActiveNav('feed')}
            >
              <span>◈</span> Discourse
            </button>
            <button
              className={`sidebar-nav-item ${activeNav === 'adda' ? 'active' : ''}`}
              onClick={() => setActiveNav('adda')}
            >
              <span>◇</span> Adda
            </button>
            <button
              className={`sidebar-nav-item ${activeNav === 'activity' ? 'active' : ''}`}
              onClick={() => setActiveNav('activity')}
            >
              <span>○</span> Alerts
            </button>
            <button
              className={`sidebar-nav-item ${activeNav === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveNav('profile')}
            >
              <span>△</span> Profile
            </button>
          </nav>
        </div>

        <div className="sidebar-user">
          <div className="post-avatar">P</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Parth Jadhav</div>
            <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>@parth</div>
          </div>
        </div>
      </aside>

      {/* 2. Center Column: Main Stream */}
      <main className="main-feed-column">
        <header className="feed-top-header">
          <div className="brand-wrapper">
            <div className="brand-badge">S</div>
            <div>
              <span className="brand-title">Setu</span>
              <span className="brand-sub">. {isAwaaz ? 'Awaaz' : 'Vistar'}</span>
            </div>
          </div>

          <button className="mode-toggle-btn" onClick={toggleMode} title="Toggle Mode">
            <span>⇄</span>
            <span>{isAwaaz ? 'Awaaz' : 'Vistar'}</span>
            <span className="mode-badge-tag">{isAwaaz ? 'आवाज़' : 'विस्तार'}</span>
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
                {isAwaaz
                  ? 'Ideas deserve a place to be heard.'
                  : 'Unabridged essays, deep commentary, and long reads.'}
              </p>
            </section>

            <div className="tabs-container">
              <button
                className={`tab-btn ${feedFilter === 'latest' ? 'active' : ''}`}
                onClick={() => setFeedFilter('latest')}
              >
                Chronological
              </button>
              <button
                className={`tab-btn ${feedFilter === 'curated' ? 'active' : ''}`}
                onClick={() => setFeedFilter('curated')}
              >
                Curated
              </button>
            </div>

            <div className="composer-box">
              <textarea
                className="composer-textarea"
                rows={isAwaaz ? 3 : 6}
                placeholder={
                  isAwaaz
                    ? "What's on your mind? Share an observation..."
                    : 'Draft your thesis or long-form essay...'
                }
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
                  Publish {isAwaaz ? 'Awaaz' : 'Essay'} ↗
                </button>
              </div>
            </div>

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
                  <p className="post-content" style={{ whiteSpace: 'pre-wrap' }}>
                    {post.content}
                  </p>
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
            <p className="subtitle">Real-time asynchronous circles and topical rooms.</p>
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
      </main>

      {/* 3. Right Rail: Context & Circles */}
      <aside className="desktop-aside">
        <div className="aside-card">
          <div className="aside-title">Active Adda Circles</div>
          <div className="circle-item">
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>#tech-architecture</div>
              <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>14 discussions today</div>
            </div>
            <button className="action-btn-silhouette">Join</button>
          </div>
          <div className="circle-item">
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>#philosophy</div>
              <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>8 active threads</div>
            </div>
            <button className="action-btn-silhouette">Join</button>
          </div>
        </div>

        <div className="aside-card">
          <div className="aside-title">Discourse Philosophy</div>
          <p style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
            Setu prioritizes focused reasoning. Use <strong>Vistar</strong> for deep dives and <strong>Awaaz</strong> for concise arguments.
          </p>
        </div>
      </aside>
    </div>
  );
}
