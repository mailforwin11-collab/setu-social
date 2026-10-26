import { useEffect, useState, useMemo } from 'react'
import './App.css'

type Mode = 'awaaz' | 'vistaar'
type Theme = 'light' | 'dark' | 'midnight'
type ActivePage = 'home' | 'explore' | 'communities' | 'notifications' | 'bookmarks' | 'profile' | 'ping'
type ProfileTab = 'posts' | 'replies' | 'photos' | 'likes' | 'saved'
type ExploreFilter = 'all' | 'posts' | 'people'
type VistaarTab = 'explore' | 'saved' | 'mine'
type FeedFilter = 'latest' | 'following'

type UserProfile = {
  name: string
  handle: string
  bio: string
  avatarLetter: string
  coverGradient: string
  joinDate: string
  followersCount: number
  followingCount: number
  isPrivate: boolean
}

type ReplyItem = {
  id: number
  authorName: string
  authorHandle: string
  time: string
  text: string
  parentId?: number
  replyToHandle?: string
  likes: number
}

type Post = {
  id: number
  uniqueId: string
  authorName: string
  authorHandle: string
  time: string
  text: string
  likes: number
  reposts: number
  isPinned?: boolean
  communityId?: string
}

type Photo = {
  id: number
  uniqueId: string
  name: string
  handle: string
  time: string
  caption: string
  src?: string
  gradient?: string
  likes: number
}

type Community = {
  id: string
  name: string
  description: string
  rules: string[]
  creatorHandle: string
  memberCount: number
  bannerGradient: string
  category: string
}

type NotificationItem = {
  id: number
  type: 'like' | 'reply' | 'follow' | 'repost'
  actorName: string
  actorHandle: string
  targetPostSnippet?: string
  time: string
  read: boolean
}

type DraftItem = {
  id: number
  text: string
  updatedAt: string
}

type ChatMessage = {
  id: number
  senderHandle: string
  text: string
  time: string
}

type ChatContact = {
  handle: string
  name: string
  avatarLetter: string
  lastSnippet: string
}

const INITIAL_PROFILE: UserProfile = {
  name: 'Parth Jadhav',
  handle: '@you',
  bio: 'Exploring decentralised media, transparent algorithms, and independent networks. Building Setu.',
  avatarLetter: 'P',
  coverGradient: 'linear-gradient(135deg, #2b3a4a 0%, #1e2638 50%, #161b26 100%)',
  joinDate: 'October 2026',
  followersCount: 142,
  followingCount: 89,
  isPrivate: false,
}

const INITIAL_COMMUNITIES: Community[] = [
  {
    id: 'comm-rationalism',
    name: 'Scientific Temper & Reason',
    description: 'Evidence-based inquiry, history of statecraft, debate, and rationalism.',
    rules: [
      'Evidence and sources must accompany statistical assertions.',
      'Critique ideas and claims, never individuals.',
      'Refrain from dogmatic assertions.',
    ],
    creatorHandle: '@aaravthinks',
    memberCount: 284,
    bannerGradient: 'linear-gradient(135deg, #1f3b4d, #14212a)',
    category: 'Science',
  },
  {
    id: 'comm-opensource',
    name: 'Open Systems & Digital Rights',
    description: 'FOSS infrastructure, data sovereignty, ActivityPub, and digital privacy.',
    rules: [
      'Code and protocols must remain inspectable and accessible.',
      'No proprietary lock-in advocacy.',
      'Maintain privacy-conscious standards in communication.',
    ],
    creatorHandle: '@you',
    memberCount: 512,
    bannerGradient: 'linear-gradient(135deg, #243b55, #141e30)',
    category: 'Tech',
  },
  {
    id: 'comm-books',
    name: 'Literature & Philosophy',
    description: 'Book reviews, translations, essays, and literary discussions.',
    rules: [
      'Credit original authors and translators.',
      'No low-effort summary spam.',
    ],
    creatorHandle: '@mirawrites',
    memberCount: 198,
    bannerGradient: 'linear-gradient(135deg, #3a2e39, #1e1b24)',
    category: 'Culture',
  },
]

const SAMPLE_POSTS: Post[] = [
  {
    id: 1,
    uniqueId: 'ST-AWA-20261018-0091',
    authorName: 'Aarav Mehta',
    authorHandle: '@aaravthinks',
    time: '14 min ago',
    text: 'A society becomes stronger when asking questions is treated as curiosity, not disrespect.',
    likes: 24,
    reposts: 3,
    isPinned: false,
    communityId: 'comm-rationalism',
  },
  {
    id: 2,
    uniqueId: 'ST-AWA-20261018-0044',
    authorName: 'Mira Kulkarni',
    authorHandle: '@mirawrites',
    time: '42 min ago',
    text: 'Not every popular opinion is a well-examined opinion. Sometimes we inherit beliefs before we ever question them.',
    likes: 19,
    reposts: 5,
    isPinned: false,
    communityId: 'comm-books',
  },
  {
    id: 3,
    uniqueId: 'ST-AWA-20261017-0812',
    authorName: 'Kabir Shah',
    authorHandle: '@kabircreates',
    time: '1 day ago',
    text: 'A small reminder: changing your mind after learning new verified information is strength, not defeat.',
    likes: 47,
    reposts: 8,
    isPinned: false,
    communityId: 'comm-opensource',
  },
]

const SAMPLE_PHOTOS: Photo[] = [
  {
    id: 101,
    uniqueId: 'ST-VIS-20261018-0012',
    name: 'Mira Kulkarni',
    handle: '@mirawrites',
    time: '2 hr ago',
    caption: 'Golden hour shadows across old stone architecture.',
    gradient: 'linear-gradient(135deg, #f6d365, #fda085)',
    likes: 38,
  },
  {
    id: 102,
    uniqueId: 'ST-VIS-20261018-0045',
    name: 'Kabir Shah',
    handle: '@kabircreates',
    time: '4 hr ago',
    caption: 'Monsoon reflections along the shoreline.',
    gradient: 'linear-gradient(135deg, #5b86e5, #36d1dc)',
    likes: 62,
  },
  {
    id: 103,
    uniqueId: 'ST-VIS-20261017-0981',
    name: 'Aarav Mehta',
    handle: '@aaravthinks',
    time: '1 day ago',
    caption: 'Books, handwritten notes, and quiet morning light.',
    gradient: 'linear-gradient(135deg, #8e9eab, #eef2f3)',
    likes: 29,
  },
]

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    type: 'like',
    actorName: 'Mira Kulkarni',
    actorHandle: '@mirawrites',
    targetPostSnippet: 'A society becomes stronger when asking questions...',
    time: '25m ago',
    read: false,
  },
  {
    id: 2,
    type: 'reply',
    actorName: 'Kabir Shah',
    actorHandle: '@kabircreates',
    targetPostSnippet: 'Curiosity without friction is the foundation...',
    time: '1h ago',
    read: false,
  },
]

const INITIAL_CONTACTS: ChatContact[] = [
  { handle: '@aaravthinks', name: 'Aarav Mehta', avatarLetter: 'A', lastSnippet: 'Let us compare notes on data sovereignty.' },
  { handle: '@mirawrites', name: 'Mira Kulkarni', avatarLetter: 'M', lastSnippet: 'Did you get a chance to read chapter three?' },
]

const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  '@aaravthinks': [
    { id: 1, senderHandle: '@aaravthinks', text: 'Hey Parth, reviewing the decentralized storage prototype.', time: '10:14 AM' },
    { id: 2, senderHandle: '@you', text: 'Looks solid so far. Local storage handles the initial state cleanly.', time: '10:16 AM' },
  ],
  '@mirawrites': [
    { id: 1, senderHandle: '@mirawrites', text: 'Did you get a chance to read chapter three?', time: 'Yesterday' },
  ],
}

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key)
    if (val) return JSON.parse(val) as T
  } catch {
    console.warn(`Failed reading storage for ${key}`)
  }
  return fallback
}

function saveStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    console.warn(`Failed writing storage for ${key}`)
  }
}

function generateSetuId(m: Mode): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase()
  const modeCode = m === 'awaaz' ? 'AWA' : 'VIS'
  return `ST-${modeCode}-${dateStr}-${randomPart}`
}

function compressImage(file: File, maxSide = 1000): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Failed reading file.'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Invalid image file.'))
      img.onload = () => {
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject(new Error('Failed processing canvas.'))
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.75))
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}

export default function App() {
  const [mode, setMode] = useState<Mode>('awaaz')
  const [theme, setTheme] = useState<Theme>(() => loadStorage('setu-theme', 'dark'))
  const [activePage, setActivePage] = useState<ActivePage>('home')
  const [profileTab, setProfileTab] = useState<ProfileTab>('posts')
  const [vistaarTab, setVistaarTab] = useState<VistaarTab>('explore')
  const [feedFilter, setFeedFilter] = useState<FeedFilter>('latest')

  const [profile, setProfile] = useState<UserProfile>(() => loadStorage('setu-profile-v3', INITIAL_PROFILE))
  const [posts, setPosts] = useState<Post[]>(() => loadStorage('setu-posts-v4', SAMPLE_POSTS))
  const [photos, setPhotos] = useState<Photo[]>(() => loadStorage('setu-photos-v4', SAMPLE_PHOTOS))
  const [replies, setReplies] = useState<Record<number, ReplyItem[]>>(() => loadStorage('setu-replies-v4', {}))
  const [photoComments, setPhotoComments] = useState<Record<number, ReplyItem[]>>(() => loadStorage('setu-photo-comments', {}))
  const [communities, setCommunities] = useState<Community[]>(() => loadStorage('setu-communities', INITIAL_COMMUNITIES))
  const [joinedCommunityIds, setJoinedCommunityIds] = useState<string[]>(() => loadStorage('setu-joined-comms', ['comm-opensource']))
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadStorage('setu-notifs', INITIAL_NOTIFICATIONS))
  const [drafts, setDrafts] = useState<DraftItem[]>(() => loadStorage('setu-drafts', []))

  // Ping Direct Messaging State
  const [activeChatHandle, setActiveChatHandle] = useState<string>('@aaravthinks')
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(() =>
    loadStorage('setu-ping-messages', INITIAL_MESSAGES),
  )
  const [pingInput, setPingInput] = useState('')

  const [likedPosts, setLikedPosts] = useState<number[]>(() => loadStorage('setu-likes', []))
  const [likedPhotos, setLikedPhotos] = useState<number[]>(() => loadStorage('setu-liked-photos', []))
  const [savedPosts, setSavedPosts] = useState<number[]>(() => loadStorage('setu-saved', []))
  const [savedPhotos, setSavedPhotos] = useState<number[]>(() => loadStorage('setu-saved-photos', []))
  const [repostedPosts, setRepostedPosts] = useState<number[]>(() => loadStorage('setu-reposts', []))
  const [following, setFollowing] = useState<string[]>(() => loadStorage('setu-following', ['@aaravthinks']))
  const [blockedHandles, setBlockedHandles] = useState<string[]>(() => loadStorage('setu-blocked', []))
  const [mutedHandles, setMutedHandles] = useState<string[]>(() => loadStorage('setu-muted', []))

  const [draftText, setDraftText] = useState('')
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [pendingPhotoImg, setPendingPhotoImg] = useState<string | null>(null)
  const [photoCaptionText, setPhotoCaptionText] = useState('')
  const [activePhotoModalId, setActivePhotoModalId] = useState<number | null>(null)
  const [photoCommentDraft, setPhotoCommentDraft] = useState('')

  const [activeMenuPostId, setActiveMenuPostId] = useState<number | null>(null)
  const [openReplyPostId, setOpenReplyPostId] = useState<number | null>(null)
  const [replyInputs, setReplyInputs] = useState<Record<number, string>>({})
  const [replyTarget, setReplyTarget] = useState<{ parentId?: number; targetHandle: string } | null>(null)
  const [collapsedThreads, setCollapsedThreads] = useState<Record<number, boolean>>({})
  const [selectedCommunityFilter, setSelectedCommunityFilter] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState('')

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false)
  const [isCreateCommOpen, setIsCreateCommOpen] = useState(false)
  const [isDraftsDrawerOpen, setIsDraftsDrawerOpen] = useState(false)
  const [editingPostId, setEditingPostId] = useState<number | null>(null)
  const [editPostContent, setEditPostContent] = useState('')
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editProfileName, setEditProfileName] = useState(profile.name)
  const [editProfileBio, setEditProfileBio] = useState(profile.bio)

  const [newCommName, setNewCommName] = useState('')
  const [newCommDesc, setNewCommDesc] = useState('')
  const [newCommRule, setNewCommRule] = useState('')
  const [newCommRulesList, setNewCommRulesList] = useState<string[]>([])

  const [searchQuery, setSearchQuery] = useState('')
  const [exploreFilter, setExploreFilter] = useState<ExploreFilter>('all')
  const [recentSearches, setRecentSearches] = useState<string[]>(() =>
    loadStorage('setu-recent-searches', ['#Democracy', 'Science & reason', '@mirawrites']),
  )

  useEffect(() => { saveStorage('setu-profile-v3', profile) }, [profile])
  useEffect(() => { saveStorage('setu-posts-v4', posts) }, [posts])
  useEffect(() => { saveStorage('setu-photos-v4', photos) }, [photos])
  useEffect(() => { saveStorage('setu-replies-v4', replies) }, [replies])
  useEffect(() => { saveStorage('setu-photo-comments', photoComments) }, [photoComments])
  useEffect(() => { saveStorage('setu-communities', communities) }, [communities])
  useEffect(() => { saveStorage('setu-joined-comms', joinedCommunityIds) }, [joinedCommunityIds])
  useEffect(() => { saveStorage('setu-notifs', notifications) }, [notifications])
  useEffect(() => { saveStorage('setu-drafts', drafts) }, [drafts])
  useEffect(() => { saveStorage('setu-ping-messages', chatMessages) }, [chatMessages])
  useEffect(() => { saveStorage('setu-likes', likedPosts) }, [likedPosts])
  useEffect(() => { saveStorage('setu-liked-photos', likedPhotos) }, [likedPhotos])
  useEffect(() => { saveStorage('setu-saved', savedPosts) }, [savedPosts])
  useEffect(() => { saveStorage('setu-saved-photos', savedPhotos) }, [savedPhotos])
  useEffect(() => { saveStorage('setu-reposts', repostedPosts) }, [repostedPosts])
  useEffect(() => { saveStorage('setu-following', following) }, [following])
  useEffect(() => { saveStorage('setu-blocked', blockedHandles) }, [blockedHandles])
  useEffect(() => { saveStorage('setu-muted', mutedHandles) }, [mutedHandles])
  useEffect(() => { saveStorage('setu-recent-searches', recentSearches) }, [recentSearches])
  useEffect(() => {
    localStorage.setItem('setu-theme', theme)
    document.documentElement.dataset.theme = theme
  }, [theme])

  function showToast(msg: string) {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3400)
  }

  function toggleMode() {
    const nextMode = mode === 'awaaz' ? 'vistaar' : 'awaaz'
    setMode(nextMode)
    setSelectedCommunityFilter(null)
    showToast(`Switched to Setu.${nextMode === 'awaaz' ? 'Awaaz (Conversations)' : 'Vistaar (Photographs)'}`)
  }

  function handleCreatePost(targetCommunityId?: string) {
    const text = draftText.trim()
    if (!text) return

    const newPost: Post = {
      id: Date.now(),
      uniqueId: generateSetuId('awaaz'),
      authorName: profile.name,
      authorHandle: profile.handle,
      time: 'Just now',
      text,
      likes: 0,
      reposts: 0,
      isPinned: false,
      communityId: targetCommunityId || selectedCommunityFilter || undefined,
    }

    setPosts([newPost, ...posts])
    setDraftText('')
    showToast('Post published to Awaaz.')
  }

  function handleSendPing() {
    const text = pingInput.trim()
    if (!text || !activeChatHandle) return

    const newMsg: ChatMessage = {
      id: Date.now(),
      senderHandle: profile.handle,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    const prev = chatMessages[activeChatHandle] || []
    setChatMessages({ ...chatMessages, [activeChatHandle]: [...prev, newMsg] })
    setPingInput('')
  }

  async function handleSelectPhotoFile(file: File | undefined) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file.')
      return
    }
    try {
      const compressed = await compressImage(file)
      setPendingPhotoImg(compressed)
    } catch {
      showToast('Could not process this image.')
    }
  }

  function handlePublishPhoto() {
    if (!pendingPhotoImg) return
    const newPhoto: Photo = {
      id: Date.now(),
      uniqueId: generateSetuId('vistaar'),
      name: profile.name,
      handle: profile.handle,
      time: 'Just now',
      caption: photoCaptionText.trim(),
      src: pendingPhotoImg,
      likes: 0,
    }

    setPhotos([newPhoto, ...photos])
    setPendingPhotoImg(null)
    setPhotoCaptionText('')
    setIsUploadOpen(false)
    setVistaarTab('explore')
    showToast('Photograph published to Vistaar.')
  }

  function handleTogglePhotoLike(id: number) {
    const isLiked = likedPhotos.includes(id)
    setLikedPhotos(isLiked ? likedPhotos.filter((x) => x !== id) : [...likedPhotos, id])
  }

  function handleTogglePhotoSave(id: number) {
    const isSaved = savedPhotos.includes(id)
    setSavedPhotos(isSaved ? savedPhotos.filter((x) => x !== id) : [...savedPhotos, id])
    showToast(isSaved ? 'Removed from collection.' : 'Saved to collection.')
  }

  function handleAddPhotoComment(photoId: number) {
    const text = photoCommentDraft.trim()
    if (!text) return

    const newComment: ReplyItem = {
      id: Date.now(),
      authorName: profile.name,
      authorHandle: profile.handle,
      time: 'Just now',
      text,
      likes: 0,
    }

    setPhotoComments({
      ...photoComments,
      [photoId]: [...(photoComments[photoId] || []), newComment],
    })
    setPhotoCommentDraft('')
  }

  function handleDeletePhoto(photoId: number) {
    if (!window.confirm('Delete this photograph permanently?')) return
    setPhotos(photos.filter((p) => p.id !== photoId))
    setActivePhotoModalId(null)
    showToast('Photo removed.')
  }

  function handleToggleLike(postId: number) {
    const isLiked = likedPosts.includes(postId)
    setLikedPosts(isLiked ? likedPosts.filter((id) => id !== postId) : [...likedPosts, postId])
    setPosts(
      posts.map((p) => (p.id === postId ? { ...p, likes: Math.max(0, p.likes + (isLiked ? -1 : 1)) } : p)),
    )
  }

  function handleToggleSave(postId: number) {
    const isSaved = savedPosts.includes(postId)
    setSavedPosts(isSaved ? savedPosts.filter((id) => id !== postId) : [...savedPosts, postId])
    showToast(isSaved ? 'Removed from bookmarks.' : 'Saved to bookmarks.')
    setActiveMenuPostId(null)
  }

  function handleToggleRepost(postId: number) {
    const isReposted = repostedPosts.includes(postId)
    setRepostedPosts(isReposted ? repostedPosts.filter((id) => id !== postId) : [...repostedPosts, postId])
    setPosts(
      posts.map((p) => (p.id === postId ? { ...p, reposts: Math.max(0, p.reposts + (isReposted ? -1 : 1)) } : p)),
    )
  }

  function handleToggleFollow(handle: string) {
    const isFollowed = following.includes(handle)
    const next = isFollowed ? following.filter((h) => h !== handle) : [...following, handle]
    setFollowing(next)
    setProfile((prev) => ({
      ...prev,
      followingCount: Math.max(0, prev.followingCount + (isFollowed ? -1 : 1)),
    }))
    showToast(isFollowed ? `Unfollowed ${handle}` : `Following ${handle}`)
  }

  function handleStartReply(postId: number, targetHandle: string, parentId?: number) {
    setOpenReplyPostId(postId)
    setReplyTarget({ parentId, targetHandle })
    const currentInput = replyInputs[postId] || ''
    if (!currentInput.includes(targetHandle)) {
      setReplyInputs({ ...replyInputs, [postId]: `${targetHandle} ${currentInput}`.trimStart() })
    }
  }

  function handleAddReply(postId: number) {
    const text = (replyInputs[postId] || '').trim()
    if (!text) return

    const newReply: ReplyItem = {
      id: Date.now(),
      authorName: profile.name,
      authorHandle: profile.handle,
      replyToHandle: replyTarget?.targetHandle,
      time: 'Just now',
      text,
      parentId: replyTarget?.parentId,
      likes: 0,
    }

    setReplies({ ...replies, [postId]: [...(replies[postId] || []), newReply] })
    setReplyInputs({ ...replyInputs, [postId]: '' })
    setReplyTarget(null)
    showToast('Reply published.')
  }

  const activePhoto = useMemo(
    () => photos.find((p) => p.id === activePhotoModalId) || null,
    [photos, activePhotoModalId],
  )

  const visiblePhotos = useMemo(() => {
    if (vistaarTab === 'saved') return photos.filter((p) => savedPhotos.includes(p.id))
    if (vistaarTab === 'mine') return photos.filter((p) => p.handle === profile.handle)
    return photos
  }, [photos, vistaarTab, savedPhotos, profile.handle])

  const activeFeedPosts = useMemo(() => {
    let list = posts.filter((p) => !blockedHandles.includes(p.authorHandle) && !mutedHandles.includes(p.authorHandle))

    if (activePage === 'bookmarks') {
      list = list.filter((p) => savedPosts.includes(p.id))
    } else if (activePage === 'communities' && selectedCommunityFilter) {
      list = list.filter((p) => p.communityId === selectedCommunityFilter)
    } else if (activePage === 'home' && feedFilter === 'following') {
      list = list.filter((p) => following.includes(p.authorHandle) || p.authorHandle === profile.handle)
    } else if (activePage === 'profile') {
      if (profileTab === 'posts') list = list.filter((p) => p.authorHandle === profile.handle)
      else if (profileTab === 'likes') list = list.filter((p) => likedPosts.includes(p.id))
      else if (profileTab === 'saved') list = list.filter((p) => savedPosts.includes(p.id))
      else if (profileTab === 'replies') {
        const postIdsWithReplies = Object.entries(replies)
          .filter(([_, rList]) => rList.some((r) => r.authorHandle === profile.handle))
          .map(([pid]) => Number(pid))
        list = list.filter((p) => postIdsWithReplies.includes(p.id))
      }
    }

    return [...list].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return b.id - a.id
    })
  }, [posts, blockedHandles, mutedHandles, activePage, selectedCommunityFilter, feedFilter, profileTab, profile.handle, likedPosts, savedPosts, replies, following])

  const unreadNotifsCount = notifications.filter((n) => !n.read).length

  return (
    <div className="app-shell" data-theme={theme}>
      {/* Top Bar Header with Left Corner Notification Bell & Unified Brand */}
      <header className="topbar">
        <div className="brand-group">
          {/* Notification Bell Icon on the Far Left Corner */}
          <button
            className="icon-corner-bell"
            onClick={() => setActivePage('notifications')}
            aria-label="Notifications"
            title="View Notifications"
          >
            🔔
            {unreadNotifsCount > 0 && <span className="corner-bell-badge">{unreadNotifsCount}</span>}
          </button>

          <div
            className="brand brand-clickable"
            onClick={toggleMode}
            onDoubleClick={toggleMode}
            title="Click or Double-tap to switch between Awaaz and Vistaar"
          >
            <span className="brand-mark">S</span>
            <span className="brand-name-text">
              Setu<span className="brand-period">.</span>
              <span className="brand-mode-label">{mode === 'awaaz' ? 'Awaaz' : 'Vistaar'}</span>
            </span>
            <button
              className="brand-quick-toggle"
              onClick={(e) => { e.stopPropagation(); toggleMode() }}
              aria-label="Switch Mode"
              title={`Switch to ${mode === 'awaaz' ? 'Vistaar' : 'Awaaz'}`}
            >
              ⇄
            </button>
          </div>
        </div>

        <div className="header-actions">
          {/* Theme Toggle (Ensures moon/sun icon is rendered crisp) */}
          <button
            className="icon-button theme-toggle"
            onClick={() => setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'midnight' : 'dark')}
            title={`Current theme: ${theme}. Click to switch.`}
          >
            {theme === 'dark' ? '☾' : theme === 'midnight' ? '🌑' : '☀'}
          </button>

          {/* Profile Avatar / Settings */}
          <button
            className="avatar profile-avatar"
            onClick={() => setIsSettingsOpen(true)}
            aria-label="Settings and Account Menu"
          >
            {profile.avatarLetter}
          </button>
        </div>
      </header>

      {/* App Body Grid */}
      <div className="page-layout">
        <aside className="left-sidebar">
          <div className="sidebar-label">PORTAL</div>
          <button
            className={`nav-item ${activePage === 'home' && !selectedCommunityFilter ? 'selected' : ''}`}
            onClick={() => { setActivePage('home'); setSelectedCommunityFilter(null) }}
          >
            ⌂ <span>Home</span>
          </button>
          <button
            className={`nav-item ${activePage === 'explore' ? 'selected' : ''}`}
            onClick={() => setActivePage('explore')}
          >
            ⌕ <span>Explore</span>
          </button>
          <button
            className={`nav-item ${activePage === 'ping' ? 'selected' : ''}`}
            onClick={() => setActivePage('ping')}
          >
            ✉ <span>Ping</span>
          </button>
          <button
            className={`nav-item ${activePage === 'communities' ? 'selected' : ''}`}
            onClick={() => setActivePage('communities')}
          >
            ♧ <span>Adda</span>
          </button>
          <button
            className={`nav-item ${activePage === 'notifications' ? 'selected' : ''}`}
            onClick={() => setActivePage('notifications')}
          >
            🔔 <span>Notifications</span>
            {unreadNotifsCount > 0 && <span className="notif-badge">{unreadNotifsCount}</span>}
          </button>
          <button
            className={`nav-item ${activePage === 'bookmarks' ? 'selected' : ''}`}
            onClick={() => setActivePage('bookmarks')}
          >
            ★ <span>Bookmarks</span>
          </button>
          <button
            className={`nav-item ${activePage === 'profile' ? 'selected' : ''}`}
            onClick={() => setActivePage('profile')}
          >
            ♙ <span>Profile</span>
          </button>

          {mode === 'awaaz' && (
            <div className="sidebar-actions-strip">
              <button className="drafts-drawer-btn" onClick={() => setIsDraftsDrawerOpen(true)}>
                📝 Drafts ({drafts.length})
              </button>
            </div>
          )}

          <div className="sidebar-note">
            <span className="note-dot" />
            <p>
              <strong>{mode === 'awaaz' ? 'Awaaz Mode' : 'Vistaar Mode'}</strong>
              <br />
              Tap brand logo above or double-tap to swap experience.
            </p>
          </div>

          <div className="sidebar-footer">
            <button className="charter-link-btn" onClick={() => setIsGuidelinesOpen(true)}>Digital Charter</button>
          </div>
        </aside>

        <main className="main-content">
          {toastMessage && (
            <div className="action-toast">
              <span>{toastMessage}</span>
              <button onClick={() => setToastMessage('')}>×</button>
            </div>
          )}

          {/* VISTAAR MODE (PHOTO FIRST) */}
          {activePage === 'home' && mode === 'vistaar' && (
            <section className="vistaar-view">
              <div className="feed-heading">
                <div>
                  <p className="eyebrow">THE VISUAL JOURNAL</p>
                  <h1>Vistaar <span>विस्तार</span></h1>
                  <p className="section-description">Moments, images and perspectives beyond words.</p>
                </div>
                <button className="publish-button" onClick={() => setIsUploadOpen(!isUploadOpen)}>
                  {isUploadOpen ? 'Close' : '+ New Photograph'}
                </button>
              </div>

              {isUploadOpen && (
                <section className="upload-panel">
                  {pendingPhotoImg ? (
                    <img className="upload-preview" src={pendingPhotoImg} alt="Preview" />
                  ) : (
                    <label className="upload-drop">
                      <span className="visual-symbol">▧</span>
                      <strong>Choose a photograph</strong>
                      <small>JPEG, PNG, or WebP. Compressed locally to preserve memory.</small>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => void handleSelectPhotoFile(e.target.files?.[0])}
                      />
                    </label>
                  )}

                  <textarea
                    className="upload-caption"
                    value={photoCaptionText}
                    onChange={(e) => setPhotoCaptionText(e.target.value)}
                    placeholder="Write a caption or describe the composition..."
                    maxLength={300}
                  />

                  <div className="edit-post-bottom">
                    <span className="char-counter">{photoCaptionText.length}/300</span>
                    <div className="composer-cta-group">
                      {pendingPhotoImg && (
                        <button className="cancel-button" onClick={() => setPendingPhotoImg(null)}>Change File</button>
                      )}
                      <button className="publish-button" onClick={handlePublishPhoto} disabled={!pendingPhotoImg}>
                        Publish Photo <span>↗</span>
                      </button>
                    </div>
                  </div>
                </section>
              )}

              <div className="feed-tabs">
                <button
                  className={`feed-tab ${vistaarTab === 'explore' ? 'active' : ''}`}
                  onClick={() => setVistaarTab('explore')}
                >
                  Gallery
                </button>
                <button
                  className={`feed-tab ${vistaarTab === 'saved' ? 'active' : ''}`}
                  onClick={() => setVistaarTab('saved')}
                >
                  Saved ({savedPhotos.length})
                </button>
                <button
                  className={`feed-tab ${vistaarTab === 'mine' ? 'active' : ''}`}
                  onClick={() => setVistaarTab('mine')}
                >
                  My Photographs
                </button>
              </div>

              {visiblePhotos.length === 0 ? (
                <div className="empty-feed">
                  <h3>No photographs found</h3>
                  <p>Publish your first photograph or check your saved collection.</p>
                </div>
              ) : (
                <div className="photo-grid">
                  {visiblePhotos.map((photo) => {
                    const likeCount = photo.likes + (likedPhotos.includes(photo.id) ? 1 : 0)
                    const commentsCount = (photoComments[photo.id] || []).length
                    return (
                      <button
                        key={photo.id}
                        className="photo-tile"
                        onClick={() => setActivePhotoModalId(photo.id)}
                      >
                        {photo.src ? (
                          <img src={photo.src} alt={photo.caption} />
                        ) : (
                          <div className="photo-gradient" style={{ background: photo.gradient }} />
                        )}
                        <span className="photo-overlay">
                          ♥ {likeCount} · ♧ {commentsCount}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </section>
          )}

          {/* AWAAZ MODE (TEXT DISCOURSE) */}
          {activePage === 'home' && mode === 'awaaz' && (
            <>
              <section className="feed-heading">
                <div>
                  <p className="eyebrow">PUBLIC DISCOURSE</p>
                  <h1>Awaaz <span>आवाज़</span></h1>
                  <p className="section-description">Ideas deserve a place to be heard.</p>
                </div>
                <span className="live-label"><span /> CHRONOLOGICAL</span>
              </section>

              {/* Feed Subtabs: Latest vs Following */}
              <div className="feed-tabs">
                <button
                  className={`feed-tab ${feedFilter === 'latest' ? 'active' : ''}`}
                  onClick={() => setFeedFilter('latest')}
                >
                  Latest (Chronological)
                </button>
                <button
                  className={`feed-tab ${feedFilter === 'following' ? 'active' : ''}`}
                  onClick={() => setFeedFilter('following')}
                >
                  Following ({following.length})
                </button>
              </div>

              <section className="composer">
                <div className="avatar composer-avatar">{profile.avatarLetter}</div>
                <div className="composer-body">
                  <textarea
                    value={draftText}
                    onChange={(e) => setDraftText(e.target.value)}
                    placeholder="What's on your mind? Share an observation or hypothesis..."
                    maxLength={600}
                  />
                  <div className="composer-bottom">
                    <span className="char-counter">{draftText.length}/600</span>
                    <div className="composer-cta-group">
                      <button className="cancel-button" onClick={() => {
                        if (!draftText.trim()) return
                        setDrafts([{ id: Date.now(), text: draftText.trim(), updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }, ...drafts])
                        setDraftText('')
                        showToast('Draft saved.')
                      }} disabled={!draftText.trim()}>
                        Save Draft
                      </button>
                      <button className="publish-button" onClick={() => handleCreatePost()} disabled={!draftText.trim()}>
                        Publish <span>↗</span>
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <div className="feed-list">
                {activeFeedPosts.length === 0 ? (
                  <div className="empty-feed">
                    <h3>No posts in your feed</h3>
                    <p>{feedFilter === 'following' ? 'Accounts you follow have not posted yet.' : 'Start a discussion or explore recommended thinkers.'}</p>
                  </div>
                ) : (
                  activeFeedPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      currentProfile={profile}
                      replies={replies[post.id] || []}
                      isLiked={likedPosts.includes(post.id)}
                      isSaved={savedPosts.includes(post.id)}
                      isReposted={repostedPosts.includes(post.id)}
                      isFollowing={following.includes(post.authorHandle)}
                      isMenuOpen={activeMenuPostId === post.id}
                      isReplyPanelOpen={openReplyPostId === post.id}
                      isCollapsed={Boolean(collapsedThreads[post.id])}
                      replyDraft={replyInputs[post.id] || ''}
                      replyTarget={replyTarget}
                      onToggleLike={() => handleToggleLike(post.id)}
                      onToggleSave={() => handleToggleSave(post.id)}
                      onToggleRepost={() => handleToggleRepost(post.id)}
                      onToggleFollow={() => handleToggleFollow(post.authorHandle)}
                      onToggleMenu={() => setActiveMenuPostId(activeMenuPostId === post.id ? null : post.id)}
                      onToggleReplyPanel={() => {
                        if (openReplyPostId === post.id) {
                          setOpenReplyPostId(null)
                          setReplyTarget(null)
                        } else {
                          handleStartReply(post.id, post.authorHandle)
                        }
                      }}
                      onStartReplyToUser={(targetHandle, parentId) => handleStartReply(post.id, targetHandle, parentId)}
                      onToggleCollapse={() => setCollapsedThreads((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                      onReplyDraftChange={(txt) => setReplyInputs({ ...replyInputs, [post.id]: txt })}
                      onSubmitReply={() => handleAddReply(post.id)}
                      onTogglePin={() => {
                        setPosts(posts.map((p) => (p.id === post.id ? { ...p, isPinned: !p.isPinned } : p)))
                        setActiveMenuPostId(null)
                      }}
                      onStartEdit={() => {
                        setEditingPostId(post.id)
                        setEditPostContent(post.text)
                        setActiveMenuPostId(null)
                      }}
                      onDelete={() => {
                        if (window.confirm('Delete post?')) setPosts(posts.filter((p) => p.id !== post.id))
                        setActiveMenuPostId(null)
                      }}
                      onCopyId={() => {
                        navigator.clipboard?.writeText(post.uniqueId)
                        setActiveMenuPostId(null)
                        showToast(`Copied ID: ${post.uniqueId}`)
                      }}
                      onCopyLink={() => {
                        navigator.clipboard?.writeText(`${window.location.origin}#post-${post.id}`)
                        setActiveMenuPostId(null)
                        showToast('Link copied.')
                      }}
                      onBlock={() => {
                        setBlockedHandles([...blockedHandles, post.authorHandle])
                        setActiveMenuPostId(null)
                      }}
                      onMute={() => {
                        setMutedHandles([...mutedHandles, post.authorHandle])
                        setActiveMenuPostId(null)
                      }}
                    />
                  ))
                )}
              </div>
            </>
          )}

          {/* PING DIRECT COMMUNICATIONS */}
          {activePage === 'ping' && (
            <div className="ping-view">
              <div className="ping-page-heading">
                <div>
                  <p className="eyebrow">DIRECT COMMUNICATIONS</p>
                  <h1>Ping <span>संवाद</span></h1>
                  <p className="ping-subtitle">Private, end-to-end conversation channels.</p>
                </div>
                <span className="ping-local-label">Local Prototype</span>
              </div>

              <div className="ping-layout">
                <aside className="ping-contacts">
                  <div className="ping-section-label">CHATS</div>
                  {INITIAL_CONTACTS.map((contact) => (
                    <button
                      key={contact.handle}
                      className={`ping-contact ${activeChatHandle === contact.handle ? 'selected' : ''}`}
                      onClick={() => setActiveChatHandle(contact.handle)}
                    >
                      <div className="avatar ping-contact-avatar">{contact.avatarLetter}</div>
                      <div className="ping-contact-copy">
                        <strong>{contact.name}</strong>
                        <small>{contact.lastSnippet}</small>
                      </div>
                    </button>
                  ))}
                </aside>

                <section className="ping-chat">
                  <div className="ping-chat-header">
                    <div className="avatar small">{activeChatHandle.charAt(1).toUpperCase()}</div>
                    <div>
                      <strong>{INITIAL_CONTACTS.find((c) => c.handle === activeChatHandle)?.name || activeChatHandle}</strong>
                      <small>{activeChatHandle}</small>
                    </div>
                  </div>

                  <div className="ping-messages">
                    {(chatMessages[activeChatHandle] || []).length === 0 ? (
                      <div className="ping-empty">
                        <span>✉</span>
                        <strong>No messages yet</strong>
                        <p>Say hello to begin the direct thread.</p>
                      </div>
                    ) : (
                      (chatMessages[activeChatHandle] || []).map((msg) => {
                        const isMine = msg.senderHandle === profile.handle
                        return (
                          <div key={msg.id} className={`ping-message-row ${isMine ? 'mine' : ''}`}>
                            <div className="ping-message-bubble">
                              <p>{msg.text}</p>
                              <small>{msg.time}</small>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>

                  <div className="ping-composer">
                    <input
                      type="text"
                      value={pingInput}
                      onChange={(e) => setPingInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendPing()
                      }}
                      placeholder={`Message ${activeChatHandle}...`}
                    />
                    <button className="publish-button compact" onClick={handleSendPing} disabled={!pingInput.trim()}>
                      Send
                    </button>
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* ADDA VIEW */}
          {activePage === 'communities' && (
            <div className="communities-view">
              <div className="communities-head-row">
                <div>
                  <p className="eyebrow">AUTONOMOUS HUBS</p>
                  <h2>Adda <span>अड्डा</span></h2>
                </div>
                <button className="publish-button compact" onClick={() => setIsCreateCommOpen(true)}>
                  + Create Adda
                </button>
              </div>

              {selectedCommunityFilter ? (
                (() => {
                  const comm = communities.find((c) => c.id === selectedCommunityFilter)
                  if (!comm) return null
                  const isMember = joinedCommunityIds.includes(comm.id)

                  return (
                    <div className="community-space-room">
                      <div className="community-banner-card" style={{ background: comm.bannerGradient }}>
                        <button className="back-link-btn" onClick={() => setSelectedCommunityFilter(null)}>
                          ← Back to Addas
                        </button>
                        <h3>{comm.name}</h3>
                        <p>{comm.description}</p>
                        <div className="comm-meta-badges">
                          <span>{comm.memberCount} Members</span>
                          <span>Admin: {comm.creatorHandle}</span>
                          <button
                            className={`join-pill-btn ${isMember ? 'active' : ''}`}
                            onClick={() => {
                              const next = isMember ? joinedCommunityIds.filter((id) => id !== comm.id) : [...joinedCommunityIds, comm.id]
                              setJoinedCommunityIds(next)
                            }}
                          >
                            {isMember ? 'Joined ✓' : '+ Join'}
                          </button>
                        </div>
                      </div>

                      <div className="community-rules-box">
                        <span className="sidebar-label">ADDA CHARTER & RULES</span>
                        <ol>
                          {comm.rules.map((rule, idx) => (
                            <li key={idx}>{rule}</li>
                          ))}
                        </ol>
                      </div>

                      <div className="feed-list">
                        {activeFeedPosts.length === 0 ? (
                          <div className="empty-feed">
                            <h3>No posts in this Adda yet</h3>
                            <p>Publish an entry to start the conversation.</p>
                          </div>
                        ) : (
                          activeFeedPosts.map((post) => (
                            <PostCard
                              key={post.id}
                              post={post}
                              currentProfile={profile}
                              replies={replies[post.id] || []}
                              isLiked={likedPosts.includes(post.id)}
                              isSaved={savedPosts.includes(post.id)}
                              isReposted={repostedPosts.includes(post.id)}
                              isFollowing={following.includes(post.authorHandle)}
                              isMenuOpen={activeMenuPostId === post.id}
                              isReplyPanelOpen={openReplyPostId === post.id}
                              isCollapsed={Boolean(collapsedThreads[post.id])}
                              replyDraft={replyInputs[post.id] || ''}
                              replyTarget={replyTarget}
                              onToggleLike={() => handleToggleLike(post.id)}
                              onToggleSave={() => handleToggleSave(post.id)}
                              onToggleRepost={() => handleToggleRepost(post.id)}
                              onToggleFollow={() => handleToggleFollow(post.authorHandle)}
                              onToggleMenu={() => setActiveMenuPostId(activeMenuPostId === post.id ? null : post.id)}
                              onToggleReplyPanel={() => handleStartReply(post.id, post.authorHandle)}
                              onStartReplyToUser={(targetHandle, parentId) => handleStartReply(post.id, targetHandle, parentId)}
                              onToggleCollapse={() => setCollapsedThreads((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                              onReplyDraftChange={(txt) => setReplyInputs({ ...replyInputs, [post.id]: txt })}
                              onSubmitReply={() => handleAddReply(post.id)}
                              onTogglePin={() => setPosts(posts.map((p) => (p.id === post.id ? { ...p, isPinned: !p.isPinned } : p)))}
                              onStartEdit={() => {
                                setEditingPostId(post.id)
                                setEditPostContent(post.text)
                              }}
                              onDelete={() => setPosts(posts.filter((p) => p.id !== post.id))}
                              onCopyId={() => navigator.clipboard?.writeText(post.uniqueId)}
                              onCopyLink={() => navigator.clipboard?.writeText(`${window.location.origin}#post-${post.id}`)}
                              onBlock={() => setBlockedHandles([...blockedHandles, post.authorHandle])}
                              onMute={() => setMutedHandles([...mutedHandles, post.authorHandle])}
                            />
                          ))
                        )}
                      </div>
                    </div>
                  )
                })()
              ) : (
                <div className="communities-grid">
                  {communities.map((comm) => {
                    const isMember = joinedCommunityIds.includes(comm.id)
                    return (
                      <div key={comm.id} className="community-card">
                        <div className="community-card-banner" style={{ background: comm.bannerGradient }} />
                        <div className="community-card-body">
                          <h4>{comm.name}</h4>
                          <p>{comm.description}</p>
                          <div className="community-card-footer">
                            <span>{comm.memberCount} Members</span>
                            <div className="comm-btn-pair">
                              <button
                                className={`join-pill-btn ${isMember ? 'active' : ''}`}
                                onClick={() => {
                                  const next = isMember ? joinedCommunityIds.filter((id) => id !== comm.id) : [...joinedCommunityIds, comm.id]
                                  setJoinedCommunityIds(next)
                                }}
                              >
                                {isMember ? 'Joined' : 'Join'}
                              </button>
                              <button className="view-space-btn" onClick={() => setSelectedCommunityFilter(comm.id)}>
                                Open →
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* NOTIFICATIONS VIEW */}
          {activePage === 'notifications' && (
            <div className="notifications-view">
              <div className="notifications-head">
                <div>
                  <p className="eyebrow">ACTIVITY STREAM</p>
                  <h2>Notifications</h2>
                </div>
                <button className="text-action-btn" onClick={() => setNotifications(notifications.map((n) => ({ ...n, read: true })))}>
                  Mark all as read
                </button>
              </div>

              <div className="notifications-list">
                {notifications.map((n) => (
                  <div key={n.id} className={`notification-item-card ${!n.read ? 'unread' : ''}`}>
                    <div className="notif-icon-bubble">
                      {n.type === 'like' && '♥'}
                      {n.type === 'reply' && '♧'}
                      {n.type === 'follow' && '♙'}
                      {n.type === 'repost' && '↻'}
                    </div>
                    <div className="notif-info-content">
                      <p>
                        <strong>{n.actorName}</strong> <span className="post-handle">{n.actorHandle}</span>{' '}
                        {n.type === 'like' && 'liked your post'}
                        {n.type === 'reply' && 'replied to your thread'}
                        {n.type === 'follow' && 'started following your profile'}
                        {n.type === 'repost' && 'reposted your thought'}
                      </p>
                      {n.targetPostSnippet && <blockquote className="notif-snippet">"{n.targetPostSnippet}"</blockquote>}
                      <span className="notif-time">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BOOKMARKS VIEW */}
          {activePage === 'bookmarks' && (
            <div className="bookmarks-view">
              <div className="feed-heading">
                <div>
                  <p className="eyebrow">SAVED CONTENT</p>
                  <h2>Bookmarks ({savedPosts.length + savedPhotos.length})</h2>
                </div>
              </div>
              <div className="feed-list">
                {activeFeedPosts.length === 0 ? (
                  <div className="empty-feed">
                    <h3>No bookmarks saved</h3>
                    <p>Use the ⋯ menu to save any thought or photograph.</p>
                  </div>
                ) : (
                  activeFeedPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      currentProfile={profile}
                      replies={replies[post.id] || []}
                      isLiked={likedPosts.includes(post.id)}
                      isSaved={true}
                      isReposted={repostedPosts.includes(post.id)}
                      isFollowing={following.includes(post.authorHandle)}
                      isMenuOpen={activeMenuPostId === post.id}
                      isReplyPanelOpen={openReplyPostId === post.id}
                      isCollapsed={Boolean(collapsedThreads[post.id])}
                      replyDraft={replyInputs[post.id] || ''}
                      replyTarget={replyTarget}
                      onToggleLike={() => handleToggleLike(post.id)}
                      onToggleSave={() => handleToggleSave(post.id)}
                      onToggleRepost={() => handleToggleRepost(post.id)}
                      onToggleFollow={() => handleToggleFollow(post.authorHandle)}
                      onToggleMenu={() => setActiveMenuPostId(activeMenuPostId === post.id ? null : post.id)}
                      onToggleReplyPanel={() => handleStartReply(post.id, post.authorHandle)}
                      onStartReplyToUser={(targetHandle, parentId) => handleStartReply(post.id, targetHandle, parentId)}
                      onToggleCollapse={() => setCollapsedThreads((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                      onReplyDraftChange={(txt) => setReplyInputs({ ...replyInputs, [post.id]: txt })}
                      onSubmitReply={() => handleAddReply(post.id)}
                      onTogglePin={() => setPosts(posts.map((p) => (p.id === post.id ? { ...p, isPinned: !p.isPinned } : p)))}
                      onStartEdit={() => {
                        setEditingPostId(post.id)
                        setEditPostContent(post.text)
                      }}
                      onDelete={() => setPosts(posts.filter((p) => p.id !== post.id))}
                      onCopyId={() => navigator.clipboard?.writeText(post.uniqueId)}
                      onCopyLink={() => navigator.clipboard?.writeText(`${window.location.origin}#post-${post.id}`)}
                      onBlock={() => setBlockedHandles([...blockedHandles, post.authorHandle])}
                      onMute={() => setMutedHandles([...mutedHandles, post.authorHandle])}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {/* EXPLORE PAGE */}
          {activePage === 'explore' && (
            <div className="explore-view">
              <section className="explore-search-box">
                <div className="search-input-wrapper">
                  <span className="search-symbol">⌕</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search posts, topics, people, or Setu ID..."
                    autoFocus
                  />
                  {searchQuery && <button className="search-clear-btn" onClick={() => setSearchQuery('')}>✕</button>}
                </div>

                <div className="explore-filter-pills">
                  {(['all', 'posts', 'people'] as ExploreFilter[]).map((filter) => (
                    <button
                      key={filter}
                      className={`filter-pill ${exploreFilter === filter ? 'active' : ''}`}
                      onClick={() => setExploreFilter(filter)}
                    >
                      {filter.toUpperCase()}
                    </button>
                  ))}
                </div>
              </section>

              {!searchQuery ? (
                <div className="recent-searches-box">
                  <div className="recent-searches-head">
                    <span className="sidebar-label">RECENT SEARCHES</span>
                    {recentSearches.length > 0 && (
                      <button className="text-action-btn" onClick={() => setRecentSearches([])}>Clear All</button>
                    )}
                  </div>
                  <div className="recent-pills-list">
                    {recentSearches.map((term) => (
                      <button key={term} className="recent-pill" onClick={() => setSearchQuery(term)}>
                        {term}
                      </button>
                    ))}
                  </div>

                  <div className="trending-tags-section">
                    <span className="sidebar-label">TAGS & TOPICS</span>
                    <div className="tag-cloud">
                      {['#OpenSource', '#MediaIndependence', '#Rationalism', '#DigitalCharter', '#PrivacyByDesign'].map((tag) => (
                        <button key={tag} className="tag-badge" onClick={() => setSearchQuery(tag)}>
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="search-results-container">
                  <p className="sidebar-label">MATCHED ENTRIES</p>
                  {activeFeedPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      currentProfile={profile}
                      replies={replies[post.id] || []}
                      isLiked={likedPosts.includes(post.id)}
                      isSaved={savedPosts.includes(post.id)}
                      isReposted={repostedPosts.includes(post.id)}
                      isFollowing={following.includes(post.authorHandle)}
                      isMenuOpen={activeMenuPostId === post.id}
                      isReplyPanelOpen={openReplyPostId === post.id}
                      isCollapsed={Boolean(collapsedThreads[post.id])}
                      replyDraft={replyInputs[post.id] || ''}
                      replyTarget={replyTarget}
                      onToggleLike={() => handleToggleLike(post.id)}
                      onToggleSave={() => handleToggleSave(post.id)}
                      onToggleRepost={() => handleToggleRepost(post.id)}
                      onToggleFollow={() => handleToggleFollow(post.authorHandle)}
                      onToggleMenu={() => setActiveMenuPostId(activeMenuPostId === post.id ? null : post.id)}
                      onToggleReplyPanel={() => handleStartReply(post.id, post.authorHandle)}
                      onStartReplyToUser={(targetHandle, parentId) => handleStartReply(post.id, targetHandle, parentId)}
                      onToggleCollapse={() => setCollapsedThreads((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                      onReplyDraftChange={(txt) => setReplyInputs({ ...replyInputs, [post.id]: txt })}
                      onSubmitReply={() => handleAddReply(post.id)}
                      onTogglePin={() => setPosts(posts.map((p) => (p.id === post.id ? { ...p, isPinned: !p.isPinned } : p)))}
                      onStartEdit={() => {
                        setEditingPostId(post.id)
                        setEditPostContent(post.text)
                      }}
                      onDelete={() => setPosts(posts.filter((p) => p.id !== post.id))}
                      onCopyId={() => navigator.clipboard?.writeText(post.uniqueId)}
                      onCopyLink={() => navigator.clipboard?.writeText(`${window.location.origin}#post-${post.id}`)}
                      onBlock={() => setBlockedHandles([...blockedHandles, post.authorHandle])}
                      onMute={() => setMutedHandles([...mutedHandles, post.authorHandle])}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PROFILE PAGE */}
          {activePage === 'profile' && (
            <div className="profile-view">
              <div className="profile-banner" style={{ background: profile.coverGradient }}>
                <div className="profile-avatar-wrapper">
                  <div className="avatar profile-main-avatar">{profile.avatarLetter}</div>
                </div>
              </div>

              <div className="profile-details-card">
                <div className="profile-actions-bar">
                  <button className="outline-btn" onClick={() => setIsEditingProfile(true)}>
                    Edit Profile
                  </button>
                </div>

                <div className="profile-names">
                  <h2>{profile.name} {profile.isPrivate && <span className="privacy-badge">🔒 Private</span>}</h2>
                  <span className="profile-handle-sub">{profile.handle}</span>
                </div>

                <p className="profile-bio-text">{profile.bio}</p>

                <div className="profile-meta-strip">
                  <span>📅 Joined {profile.joinDate}</span>
                  <span>🔐 ID Prefix: <strong>ST-USR-2026-IND</strong></span>
                </div>

                <div className="profile-stats-row">
                  <div><strong>{profile.followingCount}</strong> <span>Following</span></div>
                  <div><strong>{profile.followersCount}</strong> <span>Followers</span></div>
                  <div><strong>{posts.filter((p) => p.authorHandle === profile.handle).length}</strong> <span>Posts</span></div>
                </div>
              </div>

              <div className="feed-tabs">
                {(['posts', 'replies', 'photos', 'likes', 'saved'] as ProfileTab[]).map((tab) => (
                  <button
                    key={tab}
                    className={`feed-tab ${profileTab === tab ? 'active' : ''}`}
                    onClick={() => setProfileTab(tab)}
                  >
                    {tab === 'saved' ? 'Saved 🔒' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {profileTab === 'photos' ? (
                <div className="photo-grid">
                  {photos.filter((p) => p.handle === profile.handle).length === 0 ? (
                    <div className="empty-feed">
                      <h3>No personal photographs</h3>
                      <p>Switch to Setu.Vistaar mode to publish your first photo.</p>
                    </div>
                  ) : (
                    photos.filter((p) => p.handle === profile.handle).map((photo) => (
                      <button key={photo.id} className="photo-tile" onClick={() => setActivePhotoModalId(photo.id)}>
                        {photo.src ? <img src={photo.src} alt="" /> : <div className="photo-gradient" style={{ background: photo.gradient }} />}
                      </button>
                    ))
                  )}
                </div>
              ) : (
                <div className="feed-list">
                  {activeFeedPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      currentProfile={profile}
                      replies={replies[post.id] || []}
                      isLiked={likedPosts.includes(post.id)}
                      isSaved={savedPosts.includes(post.id)}
                      isReposted={repostedPosts.includes(post.id)}
                      isFollowing={following.includes(post.authorHandle)}
                      isMenuOpen={activeMenuPostId === post.id}
                      isReplyPanelOpen={openReplyPostId === post.id}
                      isCollapsed={Boolean(collapsedThreads[post.id])}
                      replyDraft={replyInputs[post.id] || ''}
                      replyTarget={replyTarget}
                      onToggleLike={() => handleToggleLike(post.id)}
                      onToggleSave={() => handleToggleSave(post.id)}
                      onToggleRepost={() => handleToggleRepost(post.id)}
                      onToggleFollow={() => handleToggleFollow(post.authorHandle)}
                      onToggleMenu={() => setActiveMenuPostId(activeMenuPostId === post.id ? null : post.id)}
                      onToggleReplyPanel={() => handleStartReply(post.id, post.authorHandle)}
                      onStartReplyToUser={(targetHandle, parentId) => handleStartReply(post.id, targetHandle, parentId)}
                      onToggleCollapse={() => setCollapsedThreads((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                      onReplyDraftChange={(txt) => setReplyInputs({ ...replyInputs, [post.id]: txt })}
                      onSubmitReply={() => handleAddReply(post.id)}
                      onTogglePin={() => setPosts(posts.map((p) => (p.id === post.id ? { ...p, isPinned: !p.isPinned } : p)))}
                      onStartEdit={() => {
                        setEditingPostId(post.id)
                        setEditPostContent(post.text)
                      }}
                      onDelete={() => setPosts(posts.filter((p) => p.id !== post.id))}
                      onCopyId={() => navigator.clipboard?.writeText(post.uniqueId)}
                      onCopyLink={() => navigator.clipboard?.writeText(`${window.location.origin}#post-${post.id}`)}
                      onBlock={() => setBlockedHandles([...blockedHandles, post.authorHandle])}
                      onMute={() => setMutedHandles([...mutedHandles, post.authorHandle])}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </main>

        <aside className="right-sidebar">
          <section className="side-card">
            <span className="sidebar-label">MY ADDA SPACES</span>
            <div className="joined-comms-list">
              {joinedCommunityIds.map((cid) => {
                const comm = communities.find((c) => c.id === cid)
                if (!comm) return null
                return (
                  <button
                    key={cid}
                    className="joined-comm-row-btn"
                    onClick={() => {
                      setActivePage('communities')
                      setSelectedCommunityFilter(cid)
                    }}
                  >
                    <span>♧</span>
                    <div>
                      <strong>{comm.name}</strong>
                      <small>{comm.memberCount} members</small>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          <footer className="footer-links">
            <p>Setu Platform • Independent Network</p>
          </footer>
        </aside>
      </div>

      {/* PHOTO LIGHTBOX MODAL (VISTAAR) */}
      {activePhoto && (
        <div className="modal-backdrop" onClick={() => setActivePhotoModalId(null)}>
          <div className="photo-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="photo-modal-image">
              {activePhoto.src ? (
                <img src={activePhoto.src} alt={activePhoto.caption} />
              ) : (
                <div className="photo-gradient modal-large" style={{ background: activePhoto.gradient }} />
              )}
            </div>

            <div className="photo-modal-side">
              <div className="photo-modal-head">
                <div className="avatar small">{activePhoto.name.charAt(0)}</div>
                <div className="photo-modal-who">
                  <strong>{activePhoto.name}</strong>
                  <span>{activePhoto.handle} · {activePhoto.time}</span>
                </div>
                <button className="close-btn" onClick={() => setActivePhotoModalId(null)}>✕</button>
              </div>

              <div className="photo-id-chip">
                <span>Setu ID:</span> <code>{activePhoto.uniqueId}</code>
              </div>

              {activePhoto.caption && <p className="post-body-text">{activePhoto.caption}</p>}

              <div className="photo-modal-comments">
                {(photoComments[activePhoto.id] || []).length === 0 ? (
                  <p className="no-matches-msg">No comments yet. Start the conversation.</p>
                ) : (
                  (photoComments[activePhoto.id] || []).map((comment) => (
                    <div key={comment.id} className="photo-comment-row">
                      <strong>{comment.authorName}</strong> {comment.text}
                    </div>
                  ))
                )}
              </div>

              <div className="post-actions-row">
                <button
                  className={`action-btn ${likedPhotos.includes(activePhoto.id) ? 'liked' : ''}`}
                  onClick={() => handleTogglePhotoLike(activePhoto.id)}
                >
                  {likedPhotos.includes(activePhoto.id) ? '♥' : '♡'}
                  <span>{activePhoto.likes + (likedPhotos.includes(activePhoto.id) ? 1 : 0)}</span>
                </button>

                <button
                  className={`action-btn ${savedPhotos.includes(activePhoto.id) ? 'active' : ''}`}
                  onClick={() => handleTogglePhotoSave(activePhoto.id)}
                >
                  {savedPhotos.includes(activePhoto.id) ? '★' : '☆'}
                </button>

                {activePhoto.handle === profile.handle && (
                  <button className="action-btn text-action-btn danger" onClick={() => handleDeletePhoto(activePhoto.id)}>
                    🗑 Delete
                  </button>
                )}
              </div>

              <div className="photo-comment-input-row">
                <input
                  type="text"
                  value={photoCommentDraft}
                  onChange={(e) => setPhotoCommentDraft(e.target.value)}
                  placeholder="Add a remark..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddPhotoComment(activePhoto.id)
                  }}
                />
                <button className="publish-button compact" onClick={() => handleAddPhotoComment(activePhoto.id)}>
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DRAFTS DRAWER */}
      {isDraftsDrawerOpen && (
        <div className="modal-backdrop" onClick={() => setIsDraftsDrawerOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Unfinished Drafts</h3>
              <button className="close-btn" onClick={() => setIsDraftsDrawerOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              {drafts.length === 0 ? (
                <p className="no-matches-msg">No saved drafts currently on this device.</p>
              ) : (
                <div className="drafts-list">
                  {drafts.map((d) => (
                    <div key={d.id} className="draft-entry-card">
                      <p>{d.text}</p>
                      <div className="draft-entry-footer">
                        <small>Saved at {d.updatedAt}</small>
                        <div className="draft-btn-pair">
                          <button className="text-action-btn danger" onClick={() => setDrafts(drafts.filter((i) => i.id !== d.id))}>Delete</button>
                          <button className="publish-button compact" onClick={() => {
                            setDraftText(d.text)
                            setDrafts(drafts.filter((i) => i.id !== d.id))
                            setIsDraftsDrawerOpen(false)
                          }}>Restore</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS MODAL */}
      {isSettingsOpen && (
        <div className="modal-backdrop" onClick={() => setIsSettingsOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Settings & Privacy</h3>
              <button className="close-btn" onClick={() => setIsSettingsOpen(false)}>✕</button>
            </div>
            <div className="modal-body settings-body">
              <div className="setting-section">
                <h4>Interface Appearance</h4>
                <div className="theme-selection-grid">
                  <button className={`theme-choice-btn ${theme === 'light' ? 'active' : ''}`} onClick={() => setTheme('light')}>
                    Light Paper
                  </button>
                  <button className={`theme-choice-btn ${theme === 'dark' ? 'active' : ''}`} onClick={() => setTheme('dark')}>
                    Slate Grey
                  </button>
                  <button className={`theme-choice-btn ${theme === 'midnight' ? 'active' : ''}`} onClick={() => setTheme('midnight')}>
                    True Midnight
                  </button>
                </div>
              </div>

              <div className="setting-section">
                <h4>Account Privacy</h4>
                <label className="toggle-setting-row">
                  <div>
                    <strong>Private Profile</strong>
                    <p>Only followers can view your complete timeline.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profile.isPrivate}
                    onChange={() => setProfile((p) => ({ ...p, isPrivate: !p.isPrivate }))}
                  />
                </label>
              </div>

              <div className="setting-section danger-zone">
                <h4>Data Management</h4>
                <p className="setting-subtext">Clear local browser storage and return Setu to factory state.</p>
                <button className="danger-action-btn" onClick={() => {
                  if (window.confirm('Erase all local posts, drafts, and preferences?')) {
                    localStorage.clear()
                    window.location.reload()
                  }
                }}>
                  Purge & Delete All My Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE ADDA MODAL */}
      {isCreateCommOpen && (
        <div className="modal-backdrop" onClick={() => setIsCreateCommOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Create Autonomous Adda</h3>
              <button className="close-btn" onClick={() => setIsCreateCommOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <label>
                <span>Space Name</span>
                <input
                  type="text"
                  value={newCommName}
                  onChange={(e) => setNewCommName(e.target.value)}
                  placeholder="e.g. Thane Rationalist Circle"
                />
              </label>

              <label>
                <span>Description</span>
                <textarea
                  value={newCommDesc}
                  onChange={(e) => setNewCommDesc(e.target.value)}
                  placeholder="State the objective of this space..."
                  rows={2}
                />
              </label>

              <div className="rules-builder-box">
                <span>Space Charter Rules</span>
                <div className="add-rule-input-row">
                  <input
                    type="text"
                    value={newCommRule}
                    onChange={(e) => setNewCommRule(e.target.value)}
                    placeholder="Enter rule..."
                  />
                  <button type="button" className="outline-btn" onClick={() => {
                    if (newCommRule.trim()) {
                      setNewCommRulesList([...newCommRulesList, newCommRule.trim()])
                      setNewCommRule('')
                    }
                  }}>Add</button>
                </div>
                <ul className="rules-preview-list">
                  {newCommRulesList.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setIsCreateCommOpen(false)}>Cancel</button>
              <button className="publish-button" onClick={() => {
                if (!newCommName.trim()) return
                const id = `comm-${Date.now()}`
                const comm: Community = {
                  id,
                  name: newCommName.trim(),
                  description: newCommDesc.trim() || 'No description.',
                  rules: newCommRulesList.length > 0 ? newCommRulesList : ['Maintain constructive discourse.'],
                  creatorHandle: profile.handle,
                  memberCount: 1,
                  bannerGradient: 'linear-gradient(135deg, #1b3022, #0d1a12)',
                  category: 'General',
                }
                setCommunities([comm, ...communities])
                setJoinedCommunityIds([...joinedCommunityIds, id])
                setIsCreateCommOpen(false)
                setNewCommName('')
                setNewCommDesc('')
                setNewCommRulesList([])
              }}>
                Found Space
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DIGITAL CHARTER */}
      {isGuidelinesOpen && (
        <div className="modal-backdrop" onClick={() => setIsGuidelinesOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Setu Digital Charter</h3>
              <button className="close-btn" onClick={() => setIsGuidelinesOpen(false)}>✕</button>
            </div>
            <div className="modal-body charter-scroll">
              <h4>1. Dual Experience Model</h4>
              <p>Setu combines microblogging (Awaaz) and visual storytelling (Vistaar) across a unified identity.</p>

              <h4>2. Verified Content Provenance</h4>
              <p>Each post receives an immutable cryptographic Setu ID (<code>ST-AWA-YYYYMMDD-XXXX</code> or <code>ST-VIS-YYYYMMDD-XXXX</code>) to attribute original source material across networks.</p>

              <h4>3. Algorithmic Transparency</h4>
              <p>Timelines remain strictly chronological. Recommendation engines must be auditable and disableable by users.</p>
            </div>
          </div>
        </div>
      )}

      {/* PROFILE EDIT MODAL */}
      {isEditingProfile && (
        <div className="modal-backdrop" onClick={() => setIsEditingProfile(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Edit Profile</h3>
              <button className="close-btn" onClick={() => setIsEditingProfile(false)}>✕</button>
            </div>
            <div className="modal-body">
              <label>
                <span>Full Name</span>
                <input
                  type="text"
                  value={editProfileName}
                  onChange={(e) => setEditProfileName(e.target.value)}
                  maxLength={40}
                />
              </label>
              <label>
                <span>Bio</span>
                <textarea
                  value={editProfileBio}
                  onChange={(e) => setEditProfileBio(e.target.value)}
                  maxLength={180}
                  rows={3}
                />
              </label>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setIsEditingProfile(false)}>Cancel</button>
              <button className="publish-button" onClick={() => {
                setProfile((p) => ({ ...p, name: editProfileName.trim() || p.name, bio: editProfileBio.trim() }))
                setIsEditingProfile(false)
              }}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface PostCardProps {
  post: Post
  currentProfile: UserProfile
  replies: ReplyItem[]
  isLiked: boolean
  isSaved: boolean
  isReposted: boolean
  isFollowing: boolean
  isMenuOpen: boolean
  isReplyPanelOpen: boolean
  isCollapsed: boolean
  replyDraft: string
  replyTarget: { parentId?: number; targetHandle: string } | null
  onToggleLike: () => void
  onToggleSave: () => void
  onToggleRepost: () => void
  onToggleFollow: () => void
  onToggleMenu: () => void
  onToggleReplyPanel: () => void
  onStartReplyToUser: (handle: string, parentId?: number) => void
  onToggleCollapse: () => void
  onReplyDraftChange: (text: string) => void
  onSubmitReply: () => void
  onTogglePin: () => void
  onStartEdit: () => void
  onDelete: () => void
  onCopyId: () => void
  onCopyLink: () => void
  onBlock: () => void
  onMute: () => void
}

function PostCard({
  post,
  currentProfile,
  replies,
  isLiked,
  isSaved,
  isReposted,
  isFollowing,
  isMenuOpen,
  isReplyPanelOpen,
  isCollapsed,
  replyDraft,
  replyTarget,
  onToggleLike,
  onToggleSave,
  onToggleRepost,
  onToggleFollow,
  onToggleMenu,
  onToggleReplyPanel,
  onStartReplyToUser,
  onToggleCollapse,
  onReplyDraftChange,
  onSubmitReply,
  onTogglePin,
  onStartEdit,
  onDelete,
  onCopyId,
  onCopyLink,
  onBlock,
  onMute,
}: PostCardProps) {
  const isSelf = post.authorHandle === currentProfile.handle
  const rootReplies = replies.filter((r) => !r.parentId)
  const childReplies = replies.filter((r) => r.parentId)

  return (
    <article className="post-card" id={`post-${post.id}`}>
      {post.isPinned && (
        <div className="pinned-badge-indicator">
          <span>📌 Pinned Post</span>
        </div>
      )}

      <div className="post-header-row">
        <div className="avatar post-avatar">{post.authorName.charAt(0)}</div>

        <div className="post-user-meta">
          <div className="post-user-title">
            <strong>{post.authorName}</strong>
            <span className="post-handle">{post.authorHandle}</span>
            <span className="post-dot">·</span>
            <span className="post-time">{post.time}</span>
          </div>

          <div className="post-id-chip" onClick={onCopyId} title="Click to copy Setu verification ID">
            <span>ID:</span> <code>{post.uniqueId}</code>
          </div>
        </div>

        <div className="post-menu-container">
          <button className="icon-more-btn" onClick={onToggleMenu} aria-label="Post Options">
            ⋯
          </button>

          {isMenuOpen && (
            <div className="post-dropdown-menu">
              <button onClick={onCopyId}>📋 Copy Setu ID</button>
              <button onClick={onCopyLink}>🔗 Copy Direct Link</button>
              <button onClick={onToggleSave}>{isSaved ? '★ Remove Bookmark' : '☆ Bookmark Post'}</button>
              {isSelf ? (
                <>
                  <button onClick={onTogglePin}>{post.isPinned ? 'Unpin Post' : 'Pin to Top'}</button>
                  <button onClick={onStartEdit}>✎ Edit Post</button>
                  <button className="danger-item" onClick={onDelete}>🗑 Delete Post</button>
                </>
              ) : (
                <>
                  <button onClick={onToggleFollow}>{isFollowing ? `Unfollow ${post.authorHandle}` : `Follow ${post.authorHandle}`}</button>
                  <button onClick={onMute}>🔇 Mute User</button>
                  <button className="danger-item" onClick={onBlock}>🚫 Block User</button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="post-body-text">{post.text}</div>

      <div className="post-actions-row">
        <button className={`action-btn ${isReplyPanelOpen ? 'active' : ''}`} onClick={onToggleReplyPanel} title="Reply">
          ♧ <span>{replies.length}</span>
        </button>

        <button className={`action-btn ${isReposted ? 'reposted' : ''}`} onClick={onToggleRepost} title="Repost">
          ↻ <span>{post.reposts}</span>
        </button>

        <button className={`action-btn ${isLiked ? 'liked' : ''}`} onClick={onToggleLike} title="Like">
          {isLiked ? '♥' : '♡'} <span>{post.likes}</span>
        </button>

        <button className="action-btn" onClick={onCopyLink} title="Share link">
          ↗
        </button>

        {replies.length > 0 && (
          <button className="collapse-toggle-btn" onClick={onToggleCollapse}>
            {isCollapsed ? `Show replies (${replies.length})` : 'Collapse'}
          </button>
        )}
      </div>

      {isReplyPanelOpen && (
        <section className="reply-composer-strip">
          <div className="reply-composer-inputs">
            {replyTarget && (
              <div className="replying-to-hint">
                <span>Replying to <strong>{replyTarget.targetHandle}</strong></span>
              </div>
            )}
            <textarea
              value={replyDraft}
              onChange={(e) => onReplyDraftChange(e.target.value)}
              placeholder="Post your reply..."
              rows={2}
              autoFocus
            />
            <div className="reply-composer-actions">
              <button className="publish-button compact" onClick={onSubmitReply} disabled={!replyDraft.trim()}>
                Reply
              </button>
            </div>
          </div>
        </section>
      )}

      {!isCollapsed && rootReplies.length > 0 && (
        <div className="replies-tree">
          {rootReplies.map((reply) => {
            const nested = childReplies.filter((c) => c.parentId === reply.id)
            return (
              <div key={reply.id} className="reply-node">
                <div className="reply-card">
                  <div className="avatar small">{reply.authorName.charAt(0)}</div>
                  <div className="reply-card-content">
                    <div className="reply-header">
                      <strong>{reply.authorName}</strong>
                      <span className="post-handle">{reply.authorHandle}</span>
                      <span className="post-dot">·</span>
                      <span className="post-time">{reply.time}</span>
                    </div>

                    {reply.replyToHandle && (
                      <div className="reply-target-tag">
                        Replying to <span className="mention-tag">{reply.replyToHandle}</span>
                      </div>
                    )}

                    <p className="reply-text">{reply.text}</p>
                    <div className="reply-node-actions">
                      <button className="reply-sub-btn" onClick={() => onStartReplyToUser(reply.authorHandle, reply.id)}>
                        Reply
                      </button>
                    </div>
                  </div>
                </div>

                {nested.length > 0 && (
                  <div className="nested-children-list">
                    {nested.map((subReply) => (
                      <div key={subReply.id} className="reply-node nested">
                        <div className="reply-card">
                          <div className="avatar small">{subReply.authorName.charAt(0)}</div>
                          <div className="reply-card-content">
                            <div className="reply-header">
                              <strong>{subReply.authorName}</strong>
                              <span className="post-handle">{subReply.authorHandle}</span>
                              <span className="post-dot">·</span>
                              <span className="post-time">{subReply.time}</span>
                            </div>

                            {subReply.replyToHandle && (
                              <div className="reply-target-tag">
                                Replying to <span className="mention-tag">{subReply.replyToHandle}</span>
                              </div>
                            )}

                            <p className="reply-text">{subReply.text}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </article>
  )
}