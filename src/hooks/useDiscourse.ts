import { useState, useEffect } from 'react';

export type Mode = 'awaaz' | 'vistar';

export interface Post {
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

export function useDiscourse() {
  const [mode, setMode] = useState<Mode>(() => {
    return (localStorage.getItem('setu_current_mode') as Mode) || 'awaaz';
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('setu_posts');
    return saved ? JSON.parse(saved) : DEFAULT_POSTS;
  });

  useEffect(() => {
    localStorage.setItem('setu_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('setu_current_mode', mode);
  }, [mode]);

  const toggleMode = () => {
    setMode((prev) => (prev === 'awaaz' ? 'vistar' : 'awaaz'));
  };

  const addPost = (content: string) => {
    if (!content.trim()) return;
    const newPost: Post = {
      id: Date.now().toString(),
      mode,
      author: 'Parth Jadhav',
      handle: '@parth',
      postIdCode: `ID: ST-${mode === 'awaaz' ? 'AWA' : 'VIS'}-${Date.now().toString().slice(-8)}`,
      content: content.trim(),
      timestamp: 'Just now',
      likes: 0,
      reposts: 0,
      replies: 0,
    };
    setPosts([newPost, ...posts]);
  };

  const likePost = (id: string) => {
    setPosts(posts.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p)));
  };

  const displayedPosts = posts.filter((p) => p.mode === mode);

  return {
    mode,
    toggleMode,
    isAwaaz: mode === 'awaaz',
    charLimit: mode === 'awaaz' ? 600 : 2500,
    displayedPosts,
    addPost,
    likePost,
  };
}
