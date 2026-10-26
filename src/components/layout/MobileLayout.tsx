import { useState } from 'react';
import { useSetu } from '../../hooks/useDiscourse';
import VistaarView from '../vistaar/VistaarView';

export default function MobileLayout() {
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePublish = () => {
    addAwaazPost(postText);
    setPostText('');
    setIsModalOpen(false);
  };

  return (
    <div style={{ minHeight: '100vh', padding: '0 16px 80px', maxWidth: 600, margin: '0 auto' }}>
      {/* Mobile Top Header */}
      <header className="feed-top-header">
        <div className="brand-wrapper">
          <div className="brand-badge">S</div>
          <div>
            <span className="brand-title">Setu</span>
            <span className="brand-sub">. {activePillar === 'awaaz' ? 'Awaaz' : 'Vistaar'}</span>
          </div>
        </div>
      </header>

      {/* --- Awaaz (Twitter feed) --- */}
      {activePillar === 'awaaz' && (
        <>
          <section className="section-header">
            <span className="category-tag">Public Discourse</span>
            <h1 className="main-title">Awaaz <span className="hindi-title">आवाज़</span></h1>
            <p className="subtitle">Ideas deserve a place to be heard.</p>
          </section>

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

          <button className="fab-silhouette" onClick={() => setIsModalOpen(true)}>
            +
          </button>
        </>
      )}

      {/* --- Vistaar (Instagram feed) --- */}
      {activePillar === 'vistaar' && (
        <>
          <section className="section-header">
            <span className="category-tag">Visuals</span>
            <h1 className="main-title">Vistaar <span className="hindi-title">विस्तार</span></h1>
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
          <p className="subtitle">Asynchronous circles and topical rooms.</p>
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

      {/* Awaaz Composer Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ fontWeight: 600, fontSize: 15 }}>Post an Awaaz</span>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 18, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            <textarea
              className="composer-textarea"
              rows={4}
              autoFocus
              placeholder="What's your hypothesis or observation?..."
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              maxLength={600}
            />
            <div className="composer-footer">
              <span className="char-counter">{postText.length}/600</span>
              <button
                className="btn-silhouette"
                onClick={handlePublish}
                disabled={!postText.trim()}
              >
                Post ↗
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar: Twitter (Awaaz) & Instagram (Vistaar) */}
      <nav className="mobile-bottom-nav">
        <button
          className={`nav-item-silhouette ${activePillar === 'awaaz' ? 'active' : ''}`}
          onClick={() => setActivePillar('awaaz')}
        >
          <span>◈</span>
          <span>Awaaz</span>
        </button>
        <button
          className={`nav-item-silhouette ${activePillar === 'vistaar' ? 'active' : ''}`}
          onClick={() => setActivePillar('vistaar')}
        >
          <span>▣</span>
          <span>Vistaar</span>
        </button>
        <button
          className={`nav-item-silhouette ${activePillar === 'adda' ? 'active' : ''}`}
          onClick={() => setActivePillar('adda')}
        >
          <span>◇</span>
          <span>Adda</span>
        </button>
        <button
          className={`nav-item-silhouette ${activePillar === 'profile' ? 'active' : ''}`}
          onClick={() => setActivePillar('profile')}
        >
          <span>△</span>
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
}