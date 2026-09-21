'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

// ==========================================
// CLEAN SVG ICONS (NO EMOJIS)
// ==========================================
function IconFolder({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
    </svg>
  );
}

function IconTrash({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  );
}

function IconPlus({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function IconUpload({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}

function IconRefresh({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 21h5v-5" />
    </svg>
  );
}

function IconSearch({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function IconCopy({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function IconEdit({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

function IconGrid({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  );
}

function IconList({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>
  );
}

function IconCloud({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  );
}

function IconImage({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}

function IconVideo({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m22 8-6 4 6 4V8Z" />
      <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
    </svg>
  );
}

function IconFile({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}

function IconHome({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function IconClock({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconCalendar({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function IconMic({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
}

function IconClose({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="18" x2="6" y1="6" y2="18" />
      <line x1="6" x2="18" y1="6" y2="18" />
    </svg>
  );
}

function IconDownload({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
}

function IconEye({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconMenu({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function IconPlay({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  );
}

function IconChevronLeft({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function IconChevronRight({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

// INLINE AUDIO PLAYER COMPONENT FOR VOICE NOTES
function InlineAudioCardPlayer({ src, title }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = (e) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-3 bg-gradient-to-b from-indigo-950/40 to-slate-950/80 text-center space-y-2">
      <audio
        ref={audioRef}
        src={src}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        preload="metadata"
      />
      <div className="w-12 h-12 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform" onClick={togglePlay}>
        {isPlaying ? (
          <div className="flex gap-1 items-center justify-center">
            <span className="w-1 h-4 bg-pink-400 rounded-full animate-pulse" />
            <span className="w-1 h-5 bg-pink-300 rounded-full animate-pulse delay-75" />
            <span className="w-1 h-3 bg-pink-400 rounded-full animate-pulse delay-150" />
          </div>
        ) : (
          <IconPlay size={18} className="ml-0.5" />
        )}
      </div>
      <div className="text-[11px] font-semibold text-slate-300 truncate max-w-[150px]">
        {isPlaying ? 'Playing audio...' : 'Voice Note (.webm)'}
      </div>
    </div>
  );
}

export default function DrivePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Auth & Permissions
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Folder & Navigation
  const [currentFolder, setCurrentFolder] = useState(''); // '' is root
  const [folders, setFolders] = useState([]);
  const [loadingFolders, setLoadingFolders] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Resources
  const [resources, setResources] = useState([]);
  const [resourceType, setResourceType] = useState('image'); // image, video, raw
  const [nextCursor, setNextCursor] = useState(null);
  const [loadingResources, setLoadingResources] = useState(false);

  // Selection State
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Search, Sort & View
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('created-desc'); // 'created-desc' | 'created-asc' | 'size-desc' | 'size-asc' | 'name-asc'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Modals & UI States
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [creatingFolder, setCreatingFolder] = useState(false);

  const [folderToDelete, setFolderToDelete] = useState(null); // { name, path }
  const [deletingFolder, setDeletingFolder] = useState(false);

  const [renameItem, setRenameItem] = useState(null);
  const [newPublicId, setNewPublicId] = useState('');
  const [renaming, setRenaming] = useState(false);

  const [deleteItem, setDeleteItem] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isQueryDeleteModalOpen, setIsQueryDeleteModalOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const [previewIndex, setPreviewIndex] = useState(null);

  // Upload State
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Toast System
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Clear selections when changing folder or resource type
  useEffect(() => {
    setSelectedIds(new Set());
  }, [currentFolder, resourceType]);

  // 1. Verify Auth
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login?redirect=/drive');
      return;
    }

    if (user) {
      user.getIdToken().then((token) => {
        fetch('/api/admin/overview', {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => {
            if (res.ok) {
              setIsAdmin(true);
            } else {
              setIsAdmin(false);
              router.push('/admin/login?error=unauthorized');
            }
          })
          .catch(() => {
            setIsAdmin(false);
            router.push('/admin/login?error=failed');
          })
          .finally(() => setCheckingAuth(false));
      });
    }
  }, [user, authLoading, router]);

  // 2. Fetch Folders
  const fetchFolders = useCallback(async () => {
    setLoadingFolders(true);
    try {
      const url = currentFolder
        ? `/api/drive/folders?folder=${encodeURIComponent(currentFolder)}`
        : '/api/drive/folders';
      const res = await fetch(url);
      const data = await res.json();

      if (res.ok && data.folders) {
        setFolders(data.folders);
      } else {
        setFolders([]);
      }
    } catch (err) {
      console.error('Error loading folders:', err);
    } finally {
      setLoadingFolders(false);
    }
  }, [currentFolder]);

  // 3. Fetch Resources (Assets)
  const fetchResources = useCallback(
    async (cursor = null) => {
      setLoadingResources(true);
      try {
        let url = `/api/drive/resources?resource_type=${resourceType}&folder=${encodeURIComponent(currentFolder)}&prefix=${encodeURIComponent(currentFolder)}`;
        if (cursor) url += `&next_cursor=${encodeURIComponent(cursor)}`;

        const res = await fetch(url);
        const data = await res.json();

        if (res.ok) {
          if (cursor) {
            setResources((prev) => [...prev, ...(data.resources || [])]);
          } else {
            setResources(data.resources || []);
          }
          setNextCursor(data.next_cursor || null);
        } else {
          showToast(data.error || 'Failed to load assets', 'error');
        }
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setLoadingResources(false);
      }
    },
    [currentFolder, resourceType]
  );

  useEffect(() => {
    if (isAdmin) {
      fetchFolders();
      fetchResources();
    }
  }, [isAdmin, currentFolder, resourceType, fetchFolders, fetchResources]);

  // Refresh All Data
  const handleRefresh = () => {
    fetchFolders();
    fetchResources();
    setSelectedIds(new Set());
    showToast('Drive refreshed');
  };

  // Folder Navigation
  const navigateToFolder = (path) => {
    setCurrentFolder(path);
    setIsMobileSidebarOpen(false);
  };

  const breadcrumbs = currentFolder ? currentFolder.split('/') : [];

  // Create Folder
  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    setCreatingFolder(true);
    try {
      const folderPath = currentFolder
        ? `${currentFolder}/${newFolderName.trim()}`
        : newFolderName.trim();

      const res = await fetch('/api/drive/folder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder_path: folderPath }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create folder');

      showToast(`Folder "${newFolderName}" created!`);
      setNewFolderName('');
      setIsNewFolderOpen(false);
      fetchFolders();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setCreatingFolder(false);
    }
  };

  // Delete Folder
  const handleDeleteFolder = async () => {
    if (!folderToDelete) return;
    setDeletingFolder(true);
    try {
      const res = await fetch('/api/drive/folder', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder_path: folderToDelete.path }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete folder');

      showToast(`Folder "${folderToDelete.name}" deleted successfully`);
      setFolderToDelete(null);

      if (currentFolder === folderToDelete.path || currentFolder.startsWith(folderToDelete.path + '/')) {
        const parts = folderToDelete.path.split('/');
        parts.pop();
        setCurrentFolder(parts.join('/'));
      } else {
        fetchFolders();
        fetchResources();
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setDeletingFolder(false);
    }
  };

  // Upload File
  const handleFileUpload = useCallback(
    async (files) => {
      if (!files || files.length === 0) return;

      setUploading(true);
      setUploadProgress(10);

      try {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];

          const signRes = await fetch('/api/drive/sign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ folder: currentFolder }),
          });

          const signData = await signRes.json();
          if (!signRes.ok) throw new Error(signData.error || 'Failed to get upload signature');

          let targetType = 'image';
          if (file.type.startsWith('video/')) targetType = 'video';
          else if (!file.type.startsWith('image/')) targetType = 'raw';

          const formData = new FormData();
          formData.append('file', file);
          formData.append('api_key', signData.api_key);
          formData.append('timestamp', signData.timestamp);
          formData.append('signature', signData.signature);
          if (signData.folder) {
            formData.append('folder', signData.folder);
          }

          setUploadProgress(40 + Math.round(((i + 0.5) / files.length) * 50));

          const uploadEndpoint = `https://api.cloudinary.com/v1_1/${signData.cloud_name}/${targetType}/upload`;
          const uploadRes = await fetch(uploadEndpoint, {
            method: 'POST',
            body: formData,
          });

          const uploadData = await uploadRes.json();
          if (!uploadRes.ok) throw new Error(uploadData.error?.message || 'Upload failed');
        }

        setUploadProgress(100);
        showToast(`Successfully uploaded ${files.length} file(s)!`);
        fetchResources();
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setTimeout(() => {
          setUploading(false);
          setUploadProgress(0);
        }, 500);
      }
    },
    [currentFolder, fetchResources]
  );

  // Drag & Drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  // Clipboard Paste Support (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e) => {
      if (e.clipboardData && e.clipboardData.files && e.clipboardData.files.length > 0) {
        handleFileUpload(e.clipboardData.files);
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handleFileUpload]);

  // Rename Asset
  const handleRename = async (e) => {
    e.preventDefault();
    if (!renameItem || !newPublicId.trim()) return;

    setRenaming(true);
    try {
      const res = await fetch('/api/drive/rename', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from_public_id: renameItem.public_id,
          to_public_id: newPublicId.trim(),
          resource_type: renameItem.resource_type,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to rename asset');

      showToast('Asset renamed successfully!');
      setRenameItem(null);
      setNewPublicId('');
      fetchResources();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setRenaming(false);
    }
  };

  // Delete Single Asset
  const handleDelete = async () => {
    if (!deleteItem) return;

    setDeleting(true);
    try {
      const res = await fetch('/api/drive/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          public_id: deleteItem.public_id,
          resource_type: deleteItem.resource_type,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete asset');

      showToast('Asset permanently deleted!');
      setDeleteItem(null);
      if (previewIndex !== null) setPreviewIndex(null);
      fetchResources();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Execute Batch Delete
  const executeBatchDelete = async (publicIds) => {
    if (!publicIds || publicIds.length === 0) return;

    setBulkDeleting(true);
    try {
      const res = await fetch('/api/drive/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          public_ids: publicIds,
          resource_type: resourceType,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete selected assets');

      showToast(`Successfully deleted ${data.count || publicIds.length} item(s)!`);
      setSelectedIds(new Set());
      setIsBulkDeleteModalOpen(false);
      setIsQueryDeleteModalOpen(false);
      fetchResources();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setBulkDeleting(false);
    }
  };

  // Multi-Select Handlers
  const toggleSelect = (publicId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(publicId)) {
        next.delete(publicId);
      } else {
        next.add(publicId);
      }
      return next;
    });
  };

  // Copy Clipboard Helper
  const copyToClipboard = (text, label = 'Direct link') => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`);
  };

  // Helper: Format Bytes
  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Helper: Extract File Name
  const getFileName = (publicId) => {
    if (!publicId) return '';
    const parts = publicId.split('/');
    return parts[parts.length - 1];
  };

  // Filter & Search Logic
  const filteredResources = useMemo(() => {
    let list = resources.filter((item) => {
      if (currentFolder) {
        const folderPrefix = currentFolder.endsWith('/') ? currentFolder : `${currentFolder}/`;
        if (!item.public_id.startsWith(folderPrefix) && item.public_id !== currentFolder) {
          return false;
        }
      } else {
        const hasFolderQuery = searchQuery && searchQuery.toLowerCase().includes('folder:');
        if (!hasFolderQuery && item.public_id.includes('/')) {
          return false;
        }
      }

      if (!searchQuery.trim()) return true;

      const queryTokens = searchQuery.toLowerCase().trim().split(/\s+/);

      return queryTokens.every((token) => {
        const lowerToken = token.trim();
        if (!lowerToken) return true;

        if (lowerToken.startsWith('older:')) {
          const daysStr = lowerToken.replace('older:', '').replace('d', '');
          const days = parseInt(daysStr, 10);
          if (!isNaN(days) && item.created_at) {
            const itemDate = new Date(item.created_at).getTime();
            const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
            return itemDate < cutoff;
          }
        }

        if (lowerToken.startsWith('newer:')) {
          const daysStr = lowerToken.replace('newer:', '').replace('d', '');
          const days = parseInt(daysStr, 10);
          if (!isNaN(days) && item.created_at) {
            const itemDate = new Date(item.created_at).getTime();
            const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
            return itemDate >= cutoff;
          }
        }

        if (lowerToken.startsWith('folder:')) {
          const targetFolder = lowerToken.replace('folder:', '');
          return item.public_id.toLowerCase().startsWith(targetFolder.toLowerCase());
        }

        if (lowerToken.startsWith('ext:')) {
          const ext = lowerToken.replace('ext:', '').replace('.', '');
          return (item.format || '').toLowerCase() === ext;
        }

        if (lowerToken.startsWith('size:>')) {
          const sizeStr = lowerToken.replace('size:>', '').replace('mb', '');
          const mb = parseFloat(sizeStr);
          if (!isNaN(mb)) return (item.bytes || 0) > mb * 1024 * 1024;
        }

        if (lowerToken.startsWith('size:<')) {
          const sizeStr = lowerToken.replace('size:<', '').replace('mb', '');
          const mb = parseFloat(sizeStr);
          if (!isNaN(mb)) return (item.bytes || 0) < mb * 1024 * 1024;
        }

        return item.public_id.toLowerCase().includes(lowerToken);
      });
    });

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'created-desc') {
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      }
      if (sortBy === 'created-asc') {
        return new Date(a.created_at || 0) - new Date(b.created_at || 0);
      }
      if (sortBy === 'size-desc') {
        return (b.bytes || 0) - (a.bytes || 0);
      }
      if (sortBy === 'size-asc') {
        return (a.bytes || 0) - (b.bytes || 0);
      }
      if (sortBy === 'name-asc') {
        return (a.public_id || '').localeCompare(b.public_id || '');
      }
      return 0;
    });

    return list;
  }, [resources, currentFolder, searchQuery, sortBy]);

  // Filter Subfolders
  const filteredFolders = useMemo(() => {
    if (!searchQuery.trim()) return folders;
    return folders.filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [folders, searchQuery]);

  const isAllSelected = filteredResources.length > 0 && selectedIds.size === filteredResources.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredResources.map((r) => r.public_id)));
    }
  };

  const handleBulkCopy = () => {
    const selectedUrls = filteredResources
      .filter((r) => selectedIds.has(r.public_id))
      .map((r) => r.secure_url)
      .join('\n');

    if (selectedUrls) {
      copyToClipboard(selectedUrls, `${selectedIds.size} URL(s)`);
    }
  };

  const totalFolderBytes = useMemo(() => {
    return filteredResources.reduce((acc, curr) => acc + (curr.bytes || 0), 0);
  }, [filteredResources]);

  // Lightbox Keyboard Navigation
  const previewItem = previewIndex !== null && filteredResources[previewIndex] ? filteredResources[previewIndex] : null;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (previewIndex === null) return;
      if (e.key === 'ArrowRight') {
        setPreviewIndex((prev) => (prev + 1 < filteredResources.length ? prev + 1 : 0));
      } else if (e.key === 'ArrowLeft') {
        setPreviewIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filteredResources.length - 1));
      } else if (e.key === 'Escape') {
        setPreviewIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewIndex, filteredResources.length]);

  if (authLoading || checkingAuth) {
    return (
      <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center gap-4 text-slate-200">
        <div className="w-10 h-10 border-3 border-slate-800 border-t-pink-500 rounded-full animate-spin" />
        <p className="text-sm font-semibold tracking-wide text-slate-400">Loading Cloudinary Drive Manager...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div
      className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col selection:bg-pink-500 selection:text-white font-sans antialiased overflow-hidden h-screen"
      onDragEnter={handleDrag}
    >
      {/* HIDDEN FILE INPUT */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileUpload(e.target.files)}
        multiple
        className="hidden"
      />

      {/* 1. TOP HEADER */}
      <header className="shrink-0 bg-[#0c1220] border-b border-slate-800/80 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 z-20">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          >
            <IconMenu size={18} />
          </button>

          <Link
            href="/admin/dashboard"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/60 transition-colors"
          >
            <span>← Admin</span>
          </Link>

          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-600 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-pink-900/30">
            <IconCloud size={20} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-white">
                Cloudinary Drive
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-pink-500/15 text-pink-300 border border-pink-500/30">
                PRO STORAGE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {filteredResources.length} items • Total in folder: <strong className="text-slate-200">{formatBytes(totalFolderBytes)}</strong>
            </p>
          </div>
        </div>

        {/* HEADER ACTIONS */}
        <div className="flex items-center gap-2">
          <Link
            href="/del"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/30 transition-all"
          >
            <IconTrash size={14} />
            <span className="hidden sm:inline">Expiration Engine</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsNewFolderOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            <IconPlus size={15} />
            <span className="hidden sm:inline">New Folder</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-xs font-bold shadow-md shadow-pink-950/50 transition-all disabled:opacity-50"
          >
            <IconUpload size={15} />
            <span>{uploading ? `Uploading (${uploadProgress}%)` : 'Upload Files'}</span>
          </button>

          <button
            type="button"
            onClick={handleRefresh}
            title="Refresh drive"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700"
          >
            <IconRefresh size={15} />
          </button>
        </div>
      </header>

      {/* DRAG & DROP OVERLAY */}
      {dragActive && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-6"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="border-3 border-dashed border-pink-500 rounded-3xl p-12 text-center space-y-4 max-w-md w-full bg-pink-950/20 shadow-2xl animate-pulse">
            <div className="w-16 h-16 rounded-2xl bg-pink-500/20 text-pink-400 border border-pink-500/40 flex items-center justify-center mx-auto">
              <IconUpload size={36} />
            </div>
            <h3 className="text-xl font-black text-white">Drop files to upload instantly</h3>
            <p className="text-xs text-pink-300 font-mono">
              Target Destination: /{currentFolder || 'root'}
            </p>
          </div>
        </div>
      )}

      {/* 2. MAIN LAYOUT (DUAL PANE) */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* SIDEBAR (DESKTOP & MOBILE DRAWER) */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 md:static md:z-0 w-64 bg-[#090e1a] border-r border-slate-800/80 p-4 flex flex-col gap-6 overflow-y-auto transform transition-transform duration-200 md:transform-none ${
            isMobileSidebarOpen ? 'translate-x-0 top-[57px]' : '-translate-x-full md:translate-x-0'
          }`}
        >
          {/* STORAGE ROOT */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 px-2">
              Storage Root
            </span>
            <button
              type="button"
              onClick={() => navigateToFolder('')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                currentFolder === ''
                  ? 'bg-pink-600/15 text-pink-300 border border-pink-500/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <IconHome size={16} className={currentFolder === '' ? 'text-pink-400' : 'text-slate-500'} />
              <span>Root Storage</span>
            </button>
          </div>

          {/* RESOURCE TYPE SELECTOR */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 px-2">
              Resource Category
            </span>
            {[
              { id: 'image', label: 'Images', icon: IconImage, color: 'text-sky-400' },
              { id: 'video', label: 'Videos & Audio', icon: IconVideo, color: 'text-purple-400' },
              { id: 'raw', label: 'Documents / Raw', icon: IconFile, color: 'text-amber-400' },
            ].map((cat) => {
              const Icon = cat.icon;
              const isActive = resourceType === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setResourceType(cat.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon size={16} className={cat.color} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* FOLDER EXPLORER TREE */}
          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                Folders ({folders.length})
              </span>
              <button
                type="button"
                onClick={() => setIsNewFolderOpen(true)}
                className="p-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white"
                title="Create Subfolder"
              >
                <IconPlus size={13} />
              </button>
            </div>

            {loadingFolders ? (
              <p className="text-xs text-slate-500 px-2 py-1">Loading folders...</p>
            ) : folders.length === 0 ? (
              <p className="text-xs text-slate-600 px-2 py-1">No subfolders here</p>
            ) : (
              <div className="space-y-1">
                {folders.map((f) => {
                  const isActive = currentFolder === f.path;
                  return (
                    <div
                      key={f.path}
                      className={`group flex items-center justify-between rounded-xl pr-2 transition-all ${
                        isActive ? 'bg-slate-800/90 text-pink-300 font-bold' : 'hover:bg-slate-800/40 text-slate-400'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => navigateToFolder(f.path)}
                        className="flex-1 flex items-center gap-2 px-3 py-1.5 text-xs text-left truncate"
                      >
                        <IconFolder size={15} className={isActive ? 'text-pink-400 shrink-0' : 'text-slate-500 shrink-0'} />
                        <span className="truncate">{f.name}</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFolderToDelete(f);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 p-1 transition-opacity"
                        title={`Delete folder "${f.name}"`}
                      >
                        <IconTrash size={13} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* CLIPBOARD UPLOAD TIP */}
          <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 p-3 text-[11px] text-slate-400 space-y-1">
            <strong className="text-slate-200 block">Pro Tip:</strong>
            <p>Paste screenshots directly with <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">Ctrl+V</kbd> to upload instantly!</p>
          </div>
        </aside>

        {/* MAIN STAGE CONTENT */}
        <main className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* TOOLBAR & BREADCRUMBS */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0c1220] p-3 rounded-xl border border-slate-800/80">
            {/* BREADCRUMB TRAIL */}
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-400 flex-wrap">
              <button
                type="button"
                onClick={() => navigateToFolder('')}
                className="hover:text-white px-1.5 py-0.5 rounded hover:bg-slate-800"
              >
                Root
              </button>
              {breadcrumbs.map((crumb, idx) => {
                const targetPath = breadcrumbs.slice(0, idx + 1).join('/');
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <span key={targetPath} className="flex items-center gap-1">
                    <span className="text-slate-600">/</span>
                    <button
                      type="button"
                      onClick={() => navigateToFolder(targetPath)}
                      className={`px-1.5 py-0.5 rounded hover:bg-slate-800 ${
                        isLast ? 'text-pink-400 font-bold' : 'hover:text-white'
                      }`}
                    >
                      {crumb}
                    </button>
                  </span>
                );
              })}

              {currentFolder && (
                <button
                  type="button"
                  onClick={() => {
                    const parts = currentFolder.split('/');
                    const name = parts[parts.length - 1];
                    setFolderToDelete({ name, path: currentFolder });
                  }}
                  className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] border border-red-500/20"
                  title="Delete current folder"
                >
                  <IconTrash size={12} />
                  <span>Delete Folder</span>
                </button>
              )}
            </div>

            {/* SEARCH & VIEW CONTROLS */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <IconSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search assets (ext:webm, older:30d)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#070b14] border border-slate-700/70 rounded-lg pl-8 pr-7 py-1.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-pink-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    <IconClose size={14} />
                  </button>
                )}
              </div>

              {/* SORT DROPDOWN */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#070b14] border border-slate-700/70 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-pink-500"
              >
                <option value="created-desc">Newest First</option>
                <option value="created-asc">Oldest First</option>
                <option value="size-desc">Size (Large → Small)</option>
                <option value="size-asc">Size (Small → Large)</option>
                <option value="name-asc">Name (A → Z)</option>
              </select>

              {/* VIEW SWITCHER */}
              <div className="flex rounded-lg border border-slate-700/70 bg-[#070b14] p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md text-xs transition-colors ${
                    viewMode === 'grid' ? 'bg-slate-800 text-pink-400 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Grid View"
                >
                  <IconGrid size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md text-xs transition-colors ${
                    viewMode === 'list' ? 'bg-slate-800 text-pink-400 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                  title="List View"
                >
                  <IconList size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* QUICK QUERY CHIP BUTTONS */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Quick Filters:
            </span>
            {[
              { label: 'Older than 90D', query: 'older:90d' },
              { label: 'Older than 30D', query: 'older:30d' },
              { label: 'user-uploads', query: 'folder:user-uploads' },
              { label: 'Voice Notes (.webm)', query: 'ext:webm' },
              { label: 'PNG Images', query: 'ext:png' },
              { label: 'Large Files (>2MB)', query: 'size:>2mb' },
            ].map((chip) => (
              <button
                key={chip.query}
                type="button"
                onClick={() => setSearchQuery(searchQuery === chip.query ? '' : chip.query)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                  searchQuery === chip.query
                    ? 'bg-pink-600/20 text-pink-300 border-pink-500/40 shadow-sm'
                    : 'bg-slate-800/60 hover:bg-slate-700/60 text-slate-400 border-slate-700/60'
                }`}
              >
                {chip.label}
              </button>
            ))}

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30"
              >
                Clear Query
              </button>
            )}
          </div>

          {/* FLOATING BULK ACTIONS BAR */}
          {selectedIds.size > 0 && (
            <div className="rounded-xl bg-gradient-to-r from-pink-950/80 via-slate-900/90 to-slate-900/90 border border-pink-500/40 p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-pink-600 focus:ring-pink-500"
                />
                <span className="text-xs font-extrabold text-white">
                  {selectedIds.size} of {filteredResources.length} items selected
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleBulkCopy}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 inline-flex items-center gap-1.5"
                >
                  <IconCopy size={13} />
                  <span>Copy URLs ({selectedIds.size})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsBulkDeleteModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md inline-flex items-center gap-1.5"
                >
                  <IconTrash size={13} />
                  <span>Delete Selected ({selectedIds.size})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedIds(new Set())}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                  title="Deselect all"
                >
                  <IconClose size={15} />
                </button>
              </div>
            </div>
          )}

          {/* FOLDER TILES GRID */}
          {filteredFolders.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Folders ({filteredFolders.length})
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {filteredFolders.map((f) => (
                  <div
                    key={f.path}
                    onClick={() => navigateToFolder(f.path)}
                    className="group rounded-xl bg-[#0c1220] hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 p-3 flex items-center justify-between cursor-pointer transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20 shrink-0">
                        <IconFolder size={18} />
                      </div>
                      <span className="text-xs font-bold text-slate-200 truncate">{f.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFolderToDelete(f);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 p-1 transition-opacity"
                    >
                      <IconTrash size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ASSETS SECTION (GRID OR LIST) */}
          <div className="space-y-3 flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                  Files ({filteredResources.length})
                </span>
                {filteredResources.length > 0 && (
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="text-[11px] font-semibold text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded bg-slate-800/60 border border-slate-700/60"
                  >
                    {isAllSelected ? 'Deselect All' : 'Select All'}
                  </button>
                )}
              </div>
            </div>

            {loadingResources ? (
              <div className="p-16 text-center space-y-3">
                <div className="w-10 h-10 border-3 border-slate-800 border-t-pink-500 rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-400">Loading files from Cloudinary storage...</p>
              </div>
            ) : filteredResources.length === 0 ? (
              <div className="p-16 text-center space-y-3 rounded-2xl bg-[#0c1220]/50 border border-slate-800/60">
                <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                  <IconFile size={24} />
                </div>
                <h3 className="text-sm font-bold text-slate-200">
                  {searchQuery ? `No files matching "${searchQuery}"` : 'No files in this location'}
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Upload files by dragging them here, pasting screenshots with Ctrl+V, or using the Upload button above.
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              /* GRID VIEW */
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                {filteredResources.map((item, idx) => {
                  const fileName = getFileName(item.public_id);
                  const isSelected = selectedIds.has(item.public_id);
                  const isAudio = item.format === 'webm' || item.format === 'mp3' || item.format === 'wav';

                  return (
                    <div
                      key={item.public_id}
                      className={`group relative rounded-2xl bg-[#0e1526] border overflow-hidden flex flex-col transition-all shadow-sm hover:shadow-lg ${
                        isSelected
                          ? 'border-pink-500 ring-2 ring-pink-500/20 bg-slate-900'
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {/* THUMBNAIL / MEDIA PREVIEW */}
                      <div
                        className="relative h-36 bg-[#070b14] flex items-center justify-center cursor-pointer overflow-hidden"
                        onClick={() => setPreviewIndex(idx)}
                      >
                        {/* SELECT CHECKBOX */}
                        <div
                          className="absolute top-2 left-2 z-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSelect(item.public_id);
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="w-4 h-4 rounded bg-slate-900/80 border-slate-700 text-pink-600 focus:ring-pink-500 cursor-pointer"
                          />
                        </div>

                        {isAudio ? (
                          <InlineAudioCardPlayer src={item.secure_url} title={fileName} />
                        ) : item.resource_type === 'image' ? (
                          <img
                            src={item.secure_url}
                            alt={fileName}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : item.resource_type === 'video' ? (
                          <div className="flex flex-col items-center justify-center text-purple-400 gap-1">
                            <IconVideo size={36} />
                            <span className="text-[10px] uppercase font-bold text-slate-400">{item.format}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-amber-400 gap-1">
                            <IconFile size={36} />
                            <span className="text-[10px] uppercase font-bold text-slate-400">{item.format || 'RAW'}</span>
                          </div>
                        )}

                        {/* FORMAT BADGE */}
                        <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[10px] font-mono font-bold uppercase text-slate-300">
                          {item.format || 'file'}
                        </span>
                      </div>

                      {/* DETAILS & ACTIONS */}
                      <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-xs font-semibold text-slate-200 truncate" title={item.public_id}>
                            {fileName}
                          </p>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                            <span>{formatBytes(item.bytes)}</span>
                            {item.width && item.height && <span>• {item.width}×{item.height}</span>}
                          </div>
                        </div>

                        {/* HOVER ACTIONS */}
                        <div className="flex items-center gap-1 pt-1 border-t border-slate-800/80">
                          <button
                            type="button"
                            onClick={() => copyToClipboard(item.secure_url)}
                            className="flex-1 px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold border border-slate-700/60 inline-flex items-center justify-center gap-1"
                            title="Copy URL"
                          >
                            <IconCopy size={11} />
                            <span>Copy</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setRenameItem(item);
                              setNewPublicId(item.public_id);
                            }}
                            className="p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700/60"
                            title="Rename"
                          >
                            <IconEdit size={12} />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteItem(item)}
                            className="p-1.5 rounded bg-slate-800/80 hover:bg-red-950/60 text-slate-400 hover:text-red-400 border border-slate-700/60"
                            title="Delete"
                          >
                            <IconTrash size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* LIST VIEW (TABLE) */
              <div className="rounded-2xl bg-[#0c1220] border border-slate-800 overflow-x-auto shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                      <th className="py-3 px-4 w-10">
                        <input
                          type="checkbox"
                          checked={isAllSelected}
                          onChange={toggleSelectAll}
                          className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-pink-600 focus:ring-pink-500"
                        />
                      </th>
                      <th className="py-3 px-4">Asset Name / Public ID</th>
                      <th className="py-3 px-4">Format</th>
                      <th className="py-3 px-4">Size</th>
                      <th className="py-3 px-4">Dimensions</th>
                      <th className="py-3 px-4">Created Date</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-xs">
                    {filteredResources.map((item, idx) => {
                      const fileName = getFileName(item.public_id);
                      const isSelected = selectedIds.has(item.public_id);

                      return (
                        <tr
                          key={item.public_id}
                          className={`hover:bg-slate-800/30 transition-colors ${
                            isSelected ? 'bg-pink-950/20' : ''
                          }`}
                        >
                          <td className="py-3 px-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelect(item.public_id)}
                              className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-pink-600 focus:ring-pink-500"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <div
                              className="flex items-center gap-3 cursor-pointer"
                              onClick={() => setPreviewIndex(idx)}
                            >
                              {item.resource_type === 'image' ? (
                                <img
                                  src={item.secure_url}
                                  alt=""
                                  className="w-8 h-8 rounded-lg object-cover bg-slate-900 shrink-0"
                                />
                              ) : item.resource_type === 'video' ? (
                                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                                  <IconVideo size={16} />
                                </div>
                              ) : (
                                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                                  <IconFile size={16} />
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-200 truncate">{fileName}</p>
                                <p className="text-[11px] text-slate-500 font-mono truncate">{item.public_id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-pink-300 font-mono text-[10px] font-bold uppercase border border-slate-700">
                              {item.format || item.resource_type}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-300 font-medium">{formatBytes(item.bytes)}</td>
                          <td className="py-3 px-4 text-slate-400">
                            {item.width && item.height ? `${item.width} × ${item.height}` : '—'}
                          </td>
                          <td className="py-3 px-4 text-slate-400">
                            {item.created_at ? new Date(item.created_at).toLocaleDateString() : '—'}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => copyToClipboard(item.secure_url)}
                                className="px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] font-medium border border-slate-700"
                              >
                                Copy
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setRenameItem(item);
                                  setNewPublicId(item.public_id);
                                }}
                                className="p-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700"
                                title="Rename"
                              >
                                <IconEdit size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteItem(item)}
                                className="p-1 rounded bg-slate-800/80 hover:bg-red-950/60 text-slate-400 hover:text-red-400 border border-slate-700"
                                title="Delete"
                              >
                                <IconTrash size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* 3. MODAL: FULL ASSET PREVIEW LIGHTBOX */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6" onClick={() => setPreviewIndex(null)}>
          <div className="bg-[#0e1526] border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* HEADER */}
            <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
              <div className="truncate pr-4">
                <h4 className="text-sm font-bold text-white truncate">{getFileName(previewItem.public_id)}</h4>
                <p className="text-xs text-slate-400 font-mono truncate">{previewItem.public_id}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filteredResources.length - 1))}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Previous (Left Arrow)"
                >
                  <IconChevronLeft size={16} />
                </button>
                <span className="text-xs text-slate-400 font-mono">
                  {previewIndex + 1} / {filteredResources.length}
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewIndex((prev) => (prev + 1 < filteredResources.length ? prev + 1 : 0))}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Next (Right Arrow)"
                >
                  <IconChevronRight size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewIndex(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  <IconClose size={18} />
                </button>
              </div>
            </div>

            {/* PREVIEW STAGE */}
            <div className="p-6 bg-[#070b14] flex items-center justify-center min-h-[300px] max-h-[55vh] overflow-auto">
              {previewItem.format === 'webm' || previewItem.format === 'mp3' || previewItem.format === 'wav' ? (
                <div className="w-full max-w-md p-6 bg-slate-900 rounded-2xl border border-slate-800 text-center space-y-4 shadow-xl">
                  <div className="w-16 h-16 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center justify-center mx-auto">
                    <IconMic size={28} />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">{getFileName(previewItem.public_id)}</h5>
                    <p className="text-xs text-pink-400 font-mono mt-0.5">Voice Note ({previewItem.format})</p>
                  </div>
                  <audio src={previewItem.secure_url} controls autoPlay className="w-full" />
                </div>
              ) : previewItem.resource_type === 'video' ? (
                <video src={previewItem.secure_url} controls autoPlay className="max-h-[50vh] rounded-xl shadow-2xl" />
              ) : (
                <img
                  src={previewItem.secure_url}
                  alt={previewItem.public_id}
                  className="max-h-[50vh] max-w-full rounded-xl object-contain shadow-2xl"
                />
              )}
            </div>

            {/* METADATA & EMBED TOOLBAR */}
            <div className="p-4 sm:p-5 border-t border-slate-800 bg-[#0c1220] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-4 text-slate-400 flex-wrap">
                <span>Size: <strong className="text-white">{formatBytes(previewItem.bytes)}</strong></span>
                {previewItem.width && previewItem.height && (
                  <span>Dimensions: <strong className="text-white">{previewItem.width}×{previewItem.height}</strong></span>
                )}
                <span>Created: <strong className="text-white">{new Date(previewItem.created_at).toLocaleDateString()}</strong></span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => copyToClipboard(`![${getFileName(previewItem.public_id)}](${previewItem.secure_url})`, 'Markdown code')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
                >
                  Copy Markdown
                </button>

                <button
                  type="button"
                  onClick={() => copyToClipboard(previewItem.secure_url, 'Direct URL')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 inline-flex items-center gap-1"
                >
                  <IconCopy size={13} />
                  <span>Copy URL</span>
                </button>

                <a
                  href={previewItem.secure_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold inline-flex items-center gap-1 shadow-md shadow-pink-950/40"
                >
                  <span>Open External ↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODAL: CREATE NEW FOLDER */}
      {isNewFolderOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101828] border border-slate-700 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
                <IconFolder size={22} />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white">Create New Folder</h3>
                <p className="text-xs text-slate-400">Target location: /{currentFolder || 'root'}</p>
              </div>
            </div>

            <form onSubmit={handleCreateFolder} className="space-y-4">
              <input
                type="text"
                placeholder="e.g. banners, user-avatars"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="w-full bg-[#070b14] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-pink-500"
                autoFocus
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewFolderOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingFolder || !newFolderName.trim()}
                  className="px-4 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold shadow-md disabled:opacity-50"
                >
                  {creatingFolder ? 'Creating...' : 'Create Folder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: RENAME ASSET */}
      {renameItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101828] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <IconEdit size={22} />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-extrabold text-white">Rename Asset</h3>
                <p className="text-xs text-slate-400 font-mono truncate">{renameItem.public_id}</p>
              </div>
            </div>

            <form onSubmit={handleRename} className="space-y-4">
              <input
                type="text"
                placeholder="New Public ID"
                value={newPublicId}
                onChange={(e) => setNewPublicId(e.target.value)}
                className="w-full bg-[#070b14] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-sky-500"
                autoFocus
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRenameItem(null)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={renaming || !newPublicId.trim()}
                  className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md disabled:opacity-50"
                >
                  {renaming ? 'Renaming...' : 'Rename Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL: DELETE SINGLE ASSET CONFIRMATION */}
      {deleteItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101828] border border-red-900/60 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                <IconTrash size={22} />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white">Delete Asset</h3>
                <p className="text-xs text-red-400">Permanent Removal</p>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              Are you sure you want to permanently delete this asset from Cloudinary?
            </p>

            <div className="p-2.5 rounded-lg bg-[#070b14] border border-slate-800 text-xs font-mono text-red-300 break-all">
              {deleteItem.public_id}
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteItem(null)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Permanently Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. MODAL: DELETE FOLDER CONFIRMATION */}
      {folderToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101828] border border-red-900/60 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                <IconTrash size={22} />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white">Delete Folder</h3>
                <p className="text-xs text-red-400">Recursive Folder Removal</p>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              Permanently delete folder <strong className="text-white">&quot;{folderToDelete.name}&quot;</strong> and all assets inside it?
            </p>

            <div className="p-2.5 rounded-lg bg-[#070b14] border border-slate-800 text-xs font-mono text-red-300 break-all">
              Path: {folderToDelete.path}
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setFolderToDelete(null)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteFolder}
                disabled={deletingFolder}
                className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md disabled:opacity-50"
              >
                {deletingFolder ? 'Deleting Folder...' : 'Permanently Delete Folder'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. MODAL: BULK DELETE CONFIRMATION */}
      {isBulkDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101828] border border-red-900/60 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                <IconTrash size={22} />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white">
                  Delete {selectedIds.size} Selected Assets
                </h3>
                <p className="text-xs text-red-400 font-semibold">Irreversible Batch Deletion</p>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              Permanently delete the selected <strong className="text-white">{selectedIds.size}</strong> assets from Cloudinary?
            </p>

            <div className="max-h-36 overflow-y-auto p-3 rounded-lg bg-[#070b14] border border-slate-800 text-[11px] font-mono text-red-300 space-y-1">
              {Array.from(selectedIds).map((id) => (
                <div key={id} className="truncate">• {id}</div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsBulkDeleteModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => executeBatchDelete(Array.from(selectedIds))}
                disabled={bulkDeleting}
                className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md disabled:opacity-50"
              >
                {bulkDeleting ? 'Deleting...' : `Delete ${selectedIds.size} Assets`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. TOAST SYSTEM */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold text-white flex items-center gap-2.5 transition-all border ${
            toast.type === 'error'
              ? 'bg-red-900/90 border-red-700'
              : 'bg-pink-900/90 border-pink-700'
          }`}
        >
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
