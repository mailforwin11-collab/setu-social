import { useState, useEffect } from "react";

export type Pillar = "awaaz" | "vistaar" | "adda" | "profile";
export type VistaarFormat = "shorts" | "videos" | "photos";

export interface AwaazPost {
  id: string;
  author: string;
  handle: string;
  content: string;
  timestamp: string;
  likes: number;
  reposts: number;
  replies: number;
  liked?: boolean;
}

export interface VistaarItem {
  id: string;
  format: VistaarFormat;
  creator: string;
  handle: string;
  title: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  caption: string;
  views: number;
  likes: number;
  comments: number;
  liked?: boolean;
}

const DEFAULT_AWAAZ: AwaazPost[] = [
  {
    id: "a1",
    author: "Kabir Shah",
    handle: "@kabircreates",
    content: "A small reminder: changing your mind after learning new verified information is strength, not defeat.",
    timestamp: "1h ago",
    likes: 47,
    reposts: 8,
    replies: 12,
  },
  {
    id: "a2",
    author: "Aarav Sharma",
    handle: "@aarav_code",
    content: "Software minimalism is not the absence of features, but the elimination of accidental friction.",
    timestamp: "4h ago",
    likes: 89,
    reposts: 19,
    replies: 7,
  }
];

const DEFAULT_VISTAAR: VistaarItem[] = [
  {
    id: "v1",
    format: "shorts",
    creator: "Maya Lin",
    handle: "@mayadesign",
    title: "Kinetic Typography in CSS",
    mediaUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    caption: "Exploring micro-interactions with pure CSS transforms #design #minimalism",
    views: 1420,
    likes: 312,
    comments: 24,
  },
  {
    id: "v2",
    format: "videos",
    creator: "Rohan Mehta",
    handle: "@rohan_film",
    title: "The Silent Architecture of Mumbai (Documentary)",
    mediaUrl: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&q=80",
    caption: "A 14-minute visual essay through stone corridors and sea breezes.",
    views: 8900,
    likes: 1240,
    comments: 88,
  },
  {
    id: "v3",
    format: "photos",
    creator: "Isha Patel",
    handle: "@ishashots",
    title: "Monochrome Reflections",
    mediaUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1000&q=80",
    caption: "Rain patterns on glass, Thane station at dusk.",
    views: 3400,
    likes: 540,
    comments: 31,
  }
];

export function useSetu() {
  const [activePillar, setActivePillar] = useState<Pillar>("awaaz");
  const [vistaarTab, setVistaarTab] = useState<VistaarFormat>("shorts");

  const [awaazPosts, setAwaazPosts] = useState<AwaazPost[]>(() => {
    try {
      const saved = localStorage.getItem("setu_awaaz_v2");
      return saved ? JSON.parse(saved) : DEFAULT_AWAAZ;
    } catch {
      return DEFAULT_AWAAZ;
    }
  });

  const [vistaarItems, setVistaarItems] = useState<VistaarItem[]>(() => {
    try {
      const saved = localStorage.getItem("setu_vistaar_v2");
      return saved ? JSON.parse(saved) : DEFAULT_VISTAAR;
    } catch {
      return DEFAULT_VISTAAR;
    }
  });

  useEffect(() => {
    localStorage.setItem("setu_awaaz_v2", JSON.stringify(awaazPosts));
  }, [awaazPosts]);

  useEffect(() => {
    localStorage.setItem("setu_vistaar_v2", JSON.stringify(vistaarItems));
  }, [vistaarItems]);

  const addAwaazPost = (content: string) => {
    if (!content.trim()) return;
    const post: AwaazPost = {
      id: Date.now().toString(),
      author: "Parth Jadhav",
      handle: "@parth",
      content: content.trim(),
      timestamp: "Just now",
      likes: 0,
      reposts: 0,
      replies: 0,
    };
    setAwaazPosts([post, ...awaazPosts]);
  };

  const likeAwaaz = (id: string) => {
    setAwaazPosts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const isLiked = p.liked;
        return {
          ...p,
          liked: !isLiked,
          likes: isLiked ? p.likes - 1 : p.likes + 1,
        };
      })
    );
  };

  const likeVistaar = (id: string) => {
    setVistaarItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const isLiked = item.liked;
        return {
          ...item,
          liked: !isLiked,
          likes: isLiked ? item.likes - 1 : item.likes + 1,
        };
      })
    );
  };

  return {
    activePillar,
    setActivePillar,
    vistaarTab,
    setVistaarTab,
    awaazPosts,
    vistaarItems,
    addAwaazPost,
    likeAwaaz,
    likeVistaar,
  };
}
