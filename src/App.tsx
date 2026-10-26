import { useState, useEffect } from 'react';
import './App.css';

type Mode = 'awaaz' | 'vistar';
type NavTab = 'feed' | 'adda' | 'activity' | 'profile';

interface Post {
  id: string;
  mode: Mode;
  author: string;
  handle: string;
  postIdCode: string;
  content: string;
  timestamp: string;
  likes: number;
  reposts: number;
  replies: number;
}

interface PingMessage {
  id: string;
  from: string;
  handle: string;
  message: string;
  time: string;
  unread: boolean;
}

const DEFAULT_POSTS: Post[] = [
  {
    id: '1',
    mode: 'awaaz',
    author: 'Kabir Shah',
    handle: '@kabircreates',
    postIdCode: 'ID: ST-AWA-20261017-0812',
    content: 'A small reminder: changing your mind after learning new verified information is strength, not defeat.',
    timestamp: '1 day ago',
    likes: 47,
    reposts: 8,
    replies: 0,
  },
  {
    id: '2',
    mode: 'vistar',
    author: 'Aarav Sharma',
    handle: '@aarav_code',
    postIdCode: 'ID: ST-VIS-20261016-0419',
    content: 'On Architectural Restraint: In software, minimalism is not the absence of features, but the elimination of accidental friction. When designing interfaces for discourse, fewer dials yield sharper clarity.',
    timestamp: '2 days ago',
    likes: 62,
    reposts: 14,
    replies: 5,
  }
];

const DEFAULT_PINGS: PingMessage[] = [
  {
    id: 'p1',
    from: 'Kabir Shah',
    handle: '@kabircreates',
    message: "Read your take on verified information. Let's continue in the Adda circle.",
    time: '12m ago',
    unread: true,
  },
  {
    id: 'p2',
    from: 'Ananya Verma',
    handle: '@ananya_v',
    message: 'Can you share the draft for the next Vistar publication?',
    time: '2h ago',
    unread: false,
  }
];

export default function App() {
  const [mode, setMode] = useState<Mode>(() => {
    return (localStorage.getItem('setu_current_mode') as Mode) || 'awaaz';
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('setu_posts');
    return saved ? JSON.parse(saved) : DEFAULT_POSTS;
  });

  const [pings, setPings] = useState<PingMessage[]>(DEFAULT_PINGS);
  const [activeNav, setActiveNav] = useState<NavTab>('feed');
  const [feedFilter, setFeedFilter] = useState<'latest' | 'curated'>('latest');
  const [postText, setPostText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPingOpen, setIsPingOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('setu_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('setu_current_mode', mode);
  }, [mode]);

  const toggleMode = () => {
    setMode((prev) => (prev === 'awaaz' ? 'vistar' : 'awaaz'));
  };

  const isAwaaz = mode === 'awaaz';
  const charLimit = isAwaaz ? 600 : 2500;
  const unreadPingsCount = pings.filter((p) => p.unread).length;

  const handleCreatePost = () => {
    if (!postText.trim()) return;

    const newPost: Post = {
      id: Date.now().toString(),
      mode,
      author: 'Parth Jadhav',
      handle: '@parth',
      postIdCode: `ID: ST-${isAwaaz ? 'AWA' : 'VIS'}-${Date.now().toString().slice(-8)}`,
      content: postText.trim(),
      timestamp: 'Just now',
      likes: 0,
      reposts: 0,
      replies: 0,
    };

    setPosts([newPost, ...posts]);
    setPostText('');
    setIsModalOpen(false);
  };

  const handleLike = (id: string) => {
    setPosts(posts.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p)));
  };

  const displayedPosts = posts.filter((p) => p.mode === mode);

  return (
    <div className="app-layout">
      {/* 1. Left Column: Desktop Navigation Rail */}
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
        {/* Header with Mode Toggle & Direct Pings */}
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
            <span className="mode-badge-tag">{isAwaaz ? 'आवाज़' : 'विस्तार'}</span>
          </button>

          <button
            className="top-ping-btn"
            onClick={() => {
              setIsPingOpen(!isPingOpen);
              if (!isPingOpen) setPings(pings.map((p) => ({ ...p, unread: false })));
            }}
          >
            <span>⚡</span>
            {unreadPingsCount > 0 && <span className="ping-unread-dot" />}
          </button>
        </header>

        {activeNav === 'feed' && (
          <>
            <section className="section-header">
              <span className="category-tag">
                {isAwaaz ? 'Micro Discourse' : 'Long-form Essays'}
              </span>
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
                Latest (Chronological)
              </button>
              <button
                className={`tab-btn ${feedFilter === 'curated' ? 'active' : ''}`}
                onClick={() => setFeedFilter('curated')}
              >
                Curated
              </button>
            </div>

            {/* Desktop Composer */}
            <div className="desktop-only-composer">
              <div className="composer-box">
                <textarea
                  className="composer-textarea"
                  rows={isAwaaz ? 3 : 6}
                  placeholder={
                    isAwaaz
                      ? "What's on your mind? Share an observation..."
                      : 'Draft your long-form perspective or essay...'
                  }
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  maxLength={charLimit}
                />
                <div className="composer-footer">
                  <span className="char-counter">
                    {postText.length}/{charLimit}
                  </span>
                  <button
                    className="btn-silhouette"
                    onClick={handleCreatePost}
                    disabled={!postText.trim()}
                  >
                    Publish {isAwaaz ? 'Awaaz' : 'Essay'} ↗
                  </button>
                </div>
              </div>
            </div>

            {/* Feed Stream */}
            <div className="feed-container">
              {displayedPosts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 0', color: '#64748b' }}>
                  No {isAwaaz ? 'Awaaz' : 'Vistar'} entries yet.
                </div>
              ) : (
                displayedPosts.map((post) => (
                  <article key={post.id} className="post-card">
                    <div className="post-card-header">
                      <div className="post-avatar">{post.author.charAt(0)}</div>
                      <div className="post-meta">
                        <span className="post-author">{post.author}</span>
                        <span className="post-handle">
                          {post.handle} · {post.timestamp}
                        </span>
                        <span className="post-id-badge">{post.postIdCode}</span>
                      </div>
                    </div>

                    <p className="post-content" style={{ whiteSpace: 'pre-wrap' }}>
                      {post.content}
                    </p>

                    <div className="post-actions">
                      <button
                        className="action-btn-silhouette"
                        onClick={() => handleLike(post.id)}
                      >
                        <span>♡</span> {post.likes}
                      </button>
                      <button className="action-btn-silhouette">
                        <span>↻</span> {post.reposts}
                      </button>
                      <button className="action-btn-silhouette">
                        <span>💬</span> {post.replies}
                      </button>
                    </div>
                  </article>
                ))
              )}
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

      {/* 3. Right Column: Exploration / Circles (Laptops & Desktops) */}
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
            Setu enforces intentional discourse. Switch to <strong>Vistar</strong> for essays, and <strong>Awaaz</strong> for concise arguments.
          </p>
        </div>
      </aside>

      {/* Mobile Floating Action Button */}
      <button
        className="fab-silhouette"
        onClick={() => setIsModalOpen(true)}
        aria-label="New Post"
      >
        +
      </button>

      {/* Mobile Composer Modal */}
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
              <span className="char-counter">
                {postText.length}/{charLimit}
              </span>
              <button
                className="btn-silhouette"
                onClick={handleCreatePost}
                disabled={!postText.trim()}
              >
                Publish ↗
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ping Modal */}
      {isPingOpen && (
        <div className="ping-overlay" onClick={() => setIsPingOpen(false)}>
          <div className="ping-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ping-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>⚡</span>
                <span style={{ fontWeight: 700, fontSize: 15 }}>Direct Pings</span>
              </div>
              <button
                className="close-btn-silhouette"
                onClick={() => setIsPingOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="ping-list">
              {pings.map((ping) => (
                <div key={ping.id} className="ping-item">
                  <div className="post-avatar">{ping.from.charAt(0)}</div>
                  <div className="ping-meta">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span className="post-author">{ping.from}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{ping.time}</span>
                    </div>
                    <p className="ping-preview">{ping.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
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