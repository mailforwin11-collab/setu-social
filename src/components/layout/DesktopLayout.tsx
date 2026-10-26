import { useState } from 'react';
import { useSetu } from '../../hooks/useDiscourse';
import VistaarView from '../vistaar/VistaarView';

export default function DesktopLayout() {
  const {
    activePillar,
    setActivePillar,
    vistaarTab,
    setVistaarTab,
    awaazPosts,
    vistaarItems,
    addAwaazPost,
    likeAwaaz,
  } = useSetu();

  const [postText, setPostText] = useState('');
  const [feedFilter, setFeedFilter] = useState<'latest' | 'curated'>('latest');

  const handlePublishAwaaz = () => {
    addAwaazPost(postText);
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
              className={`sidebar-nav-item ${activePillar === 'awaaz' ? 'active' : ''}`}
              onClick={() => setActivePillar('awaaz')}
            >
              <span>◈</span> Awaaz <small style={{ color: 'var(--text-dim)', marginLeft: 'auto' }}>Text</small>
            </button>
            <button
              className={`sidebar-nav-item ${activePillar === 'vistaar' ? 'active' : ''}`}
              onClick={() => setActivePillar('vistaar')}
            >
              <span>▣</span> Vistaar <small style={{ color: 'var(--text-dim)', marginLeft: 'auto' }}>Media</small>
            </button>
            <button
              className={`sidebar-nav-item ${activePillar === 'adda' ? 'active' : ''}`}
              onClick={() => setActivePillar('adda')}
            >
              <span>◇</span> Adda
            </button>
            <button
              className={`sidebar-nav-item ${activePillar === 'profile' ? 'active' : ''}`}
              onClick={() => setActivePillar('profile')}
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

      {/* 2. Center Column */}
      <main className="main-feed-column">
        <header className="feed-top-header">
          <div className="brand-wrapper">
            <div className="brand-badge">S</div>
            <div>
              <span className="brand-title">Setu</span>
              <span className="brand-sub">. {activePillar === 'awaaz' ? 'Awaaz (Discourse)' : 'Vistaar (Visuals)'}</span>
            </div>
          </div>
        </header>

        {/* --- Awaaz (Twitter View) --- */}
        {activePillar === 'awaaz' && (
          <>
            <section className="section-header">
              <span className="category-tag">Public Discourse</span>
              <h1 className="main-title">Awaaz <span className="hindi-title">आवाज़</span></h1>
              <p className="subtitle">Ideas, hypotheses, and sharp opinions.</p>
            </section>

            <div className="tabs-container">
              <button
                className={`tab-btn ${feedFilter === 'latest' ? 'active' : ''}`}
                onClick={() => setFeedFilter('latest')}
              >
                Latest (Chronological)
              </button>
              <button
                className={`tab-btn ${feedFilter === 'curated' ? 'active' : ''}`}
                onClick={() => setFeedFilter('curated')}
              >
                Curated
              </button>
            </div>

            {/* Twitter-style Composer */}
            <div className="composer-box">
              <textarea
                className="composer-textarea"
                rows={3}
                placeholder="What's your hypothesis or observation?"
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                maxLength={600}
              />
              <div className="composer-footer">
                <span className="char-counter">{postText.length}/600</span>
                <button
                  className="btn-silhouette"
                  onClick={handlePublishAwaaz}
                  disabled={!postText.trim()}
                >
                  Post Awaaz ↗
                </button>
              </div>
            </div>

            {/* Awaaz Post Stream */}
            <div className="feed-container">
              {awaazPosts.map((post) => (
                <article key={post.id} className="post-card">
                  <div className="post-card-header">
                    <div className="post-avatar">{post.author.charAt(0)}</div>
                    <div className="post-meta">
                      <span className="post-author">{post.author}</span>
                      <span className="post-handle">{post.handle} · {post.timestamp}</span>
                    </div>
                  </div>
                  <p className="post-content">{post.content}</p>
                  <div className="post-actions">
                    <button className="action-btn-silhouette" onClick={() => likeAwaaz(post.id)}>
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

        {/* --- Vistaar (Instagram/Media View) --- */}
        {activePillar === 'vistaar' && (
          <>
            <section className="section-header">
              <span className="category-tag">Visual Discovery</span>
              <h1 className="main-title">Vistaar <span className="hindi-title">विस्तार</span></h1>
              <p className="subtitle">Shorts, long-form videos, and photo galleries.</p>
            </section>

            <VistaarView
              items={vistaarItems}
              currentTab={vistaarTab}
              onTabChange={setVistaarTab}
            />
          </>
        )}

        {/* --- Adda --- */}
        {activePillar === 'adda' && (
          <section className="section-header">
            <span className="category-tag">Public Commons</span>
            <h1 className="main-title">Adda <span className="hindi-title">अड्डा</span></h1>
            <p className="subtitle">Real-time asynchronous circles and topical rooms.</p>
          </section>
        )}

        {/* --- Profile --- */}
        {activePillar === 'profile' && (
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

      {/* 3. Right Rail */}
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
      </aside>
    </div>
  );
}