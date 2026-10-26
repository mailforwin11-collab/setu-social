import { useState, useEffect } from 'react';
import './App.css';

interface Post {
  id: string;
  author: string;
  handle: string;
  postIdCode: string;
  content: string;
  timestamp: string;
  likes: number;
  reposts: number;
  replies: number;
}

const DEFAULT_POSTS: Post[] = [
  {
    id: '1',
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
    author: 'Aarav Sharma',
    handle: '@aarav_code',
    postIdCode: 'ID: ST-AWA-20261016-0419',
    content: 'Building in public with React and Vite. Focused on minimal footprint and speed.',
    timestamp: '2 days ago',
    likes: 31,
    reposts: 4,
    replies: 2,
  }
];

export default function App() {
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('setu_posts');
    return saved ? JSON.parse(saved) : DEFAULT_POSTS;
  });

  const [activeTab, setActiveTab] = useState<'awaaz' | 'adda' | 'activity' | 'profile'>('awaaz');
  const [feedFilter, setFeedFilter] = useState<'latest' | 'following'>('latest');
  const [postText, setPostText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('setu_posts', JSON.stringify(posts));
  }, [posts]);

  const handleCreatePost = () => {
    if (!postText.trim()) return;

    const newPost: Post = {
      id: Date.now().toString(),
      author: 'Parth Jadhav',
      handle: '@parth',
      postIdCode: `ID: ST-AWA-${Date.now().toString().slice(-8)}`,
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
    setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  return (
    <div className="app-container">
      {/* Top Header */}
      <header className="top-header">
        <div className="brand-wrapper">
          <div className="brand-badge">S</div>
          <div>
            <span className="brand-title">Setu</span>
            <span className="brand-sub">. Awaaz</span>
          </div>
        </div>
        <div className="user-avatar-badge">P</div>
      </header>

      {/* Title Section */}
      <section className="section-header">
        <span className="category-tag">Public Discourse</span>
        <h1 className="main-title">
          Awaaz <span className="hindi-title">आवाज़</span>
        </h1>
        <p className="subtitle">Ideas deserve a place to be heard.</p>
      </section>

      {/* Tabs */}
      <div className="tabs-container">
        <button 
          className={`tab-btn ${feedFilter === 'latest' ? 'active' : ''}`}
          onClick={() => setFeedFilter('latest')}
        >
          Latest (Chronological)
        </button>
        <button 
          className={`tab-btn ${feedFilter === 'following' ? 'active' : ''}`}
          onClick={() => setFeedFilter('following')}
        >
          Following (1)
        </button>
      </div>

      {/* Desktop-only Inline Composer */}
      <div className="desktop-only-composer">
        <div className="composer-box">
          <textarea
            className="composer-textarea"
            rows={3}
            placeholder="What's on your mind? Share an observation or hypothesis..."
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            maxLength={600}
          />
          <div className="composer-footer">
            <span className="char-counter">{postText.length}/600</span>
            <button 
              className="btn-primary" 
              onClick={handleCreatePost}
              disabled={!postText.trim()}
            >
              Publish ↗
            </button>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="feed-container">
        {posts.map((post) => (
          <article key={post.id} className="post-card">
            <div className="post-card-header">
              <div className="post-avatar">{post.author.charAt(0)}</div>
              <div className="post-meta">
                <span className="post-author">{post.author}</span>
                <span className="post-handle">{post.handle} · {post.timestamp}</span>
                <span className="post-id-badge">{post.postIdCode}</span>
              </div>
            </div>

            <p className="post-content">{post.content}</p>

            <div className="post-actions">
              <button className="action-btn" onClick={() => handleLike(post.id)}>
                ♡ {post.likes}
              </button>
              <button className="action-btn">
                ↻ {post.reposts}
              </button>
              <button className="action-btn">
                💬 {post.replies}
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Mobile Floating Action Button (FAB) */}
      <button 
        className="fab-composer" 
        onClick={() => setIsModalOpen(true)}
        aria-label="Create Post"
      >
        +
      </button>

      {/* Mobile Composer Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontWeight: 600, fontSize: 16 }}>New Post</span>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#888', fontSize: 18, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            <textarea
              className="composer-textarea"
              rows={4}
              autoFocus
              placeholder="What's on your mind? Share an observation or hypothesis..."
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              maxLength={600}
            />
            <div className="composer-footer">
              <span className="char-counter">{postText.length}/600</span>
              <button 
                className="btn-primary" 
                onClick={handleCreatePost}
                disabled={!postText.trim()}
              >
                Publish ↗
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Mobile Bottom Nav */}
      <nav className="mobile-bottom-nav">
        <button 
          className={`bottom-nav-item ${activeTab === 'awaaz' ? 'active' : ''}`}
          onClick={() => setActiveTab('awaaz')}
        >
          <span className="bottom-nav-icon">🏠</span>
          <span>Awaaz</span>
        </button>
        <button 
          className={`bottom-nav-item ${activeTab === 'adda' ? 'active' : ''}`}
          onClick={() => setActiveTab('adda')}
        >
          <span className="bottom-nav-icon">💬</span>
          <span>Adda</span>
        </button>
        <button 
          className={`bottom-nav-item ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          <span className="bottom-nav-icon">🔔</span>
          <span>Activity</span>
          <span className="bottom-nav-badge">2</span>
        </button>
        <button 
          className={`bottom-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <span className="bottom-nav-icon">👤</span>
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
}