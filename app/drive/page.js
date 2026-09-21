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
function InlineAudioCardPlayer({ src }) {
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
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, rgba(11,15,25,0.9) 100%)' }}>
      <audio
        ref={audioRef}
        src={src}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        preload="metadata"
      />
      <button
        type="button"
        onClick={togglePlay}
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: 'rgba(236, 72, 153, 0.25)',
          color: '#f472b6',
          border: '1px solid rgba(236, 72, 153, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(236, 72, 153, 0.2)',
        }}
      >
        {isPlaying ? (
          <div style={{ display: 'flex', gap: '3px', alignItems: 'center', height: '16px' }}>
            <span style={{ width: '3px', height: '12px', background: '#f472b6', borderRadius: '2px', animation: 'drive-pulse 0.6s infinite alternate' }} />
            <span style={{ width: '3px', height: '16px', background: '#fbcfe8', borderRadius: '2px', animation: 'drive-pulse 0.6s 0.2s infinite alternate' }} />
            <span style={{ width: '3px', height: '10px', background: '#f472b6', borderRadius: '2px', animation: 'drive-pulse 0.6s 0.4s infinite alternate' }} />
          </div>
        ) : (
          <IconPlay size={18} style={{ marginLeft: '2px' }} />
        )}
      </button>
      <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#cbd5e1' }}>
        {isPlaying ? 'Playing audio...' : 'Voice Note (.webm)'}
      </span>
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
      <div style={{ minHeight: '100vh', background: '#070b14', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #1e293b', borderTopColor: '#ec4899', borderRadius: '50%', animation: 'drive-spin 0.8s linear infinite' }} />
        <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#94a3b8' }}>Loading Cloudinary Drive Manager...</p>
        <style>{`@keyframes drive-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div style={driveStyles.container} onDragEnter={handleDrag}>
      <style>{driveCSS}</style>

      {/* HIDDEN FILE INPUT */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileUpload(e.target.files)}
        multiple
        style={{ display: 'none' }}
      />

      {/* 1. TOP HEADER */}
      <header style={driveStyles.header}>
        <div style={driveStyles.brandGroup}>
          <Link href="/admin/dashboard" style={driveStyles.backBtn}>
            ← Admin
          </Link>

          <div style={driveStyles.logoBadge}>
            <IconCloud size={20} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h1 style={driveStyles.title}>Cloudinary Drive</h1>
              <span style={driveStyles.proBadge}>PRO STORAGE</span>
            </div>
            <p style={driveStyles.subtitle}>
              {filteredResources.length} items • Total size in folder: <strong style={{ color: '#fff' }}>{formatBytes(totalFolderBytes)}</strong>
            </p>
          </div>
        </div>

        {/* HEADER ACTIONS */}
        <div style={driveStyles.headerActions}>
          <Link href="/del" style={driveStyles.expirationBtn}>
            <IconTrash size={14} />
            <span>Expiration Engine</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsNewFolderOpen(true)}
            style={driveStyles.secondaryBtn}
          >
            <IconPlus size={15} />
            <span>New Folder</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            style={driveStyles.primaryBtn}
          >
            <IconUpload size={15} />
            <span>{uploading ? `Uploading (${uploadProgress}%)` : 'Upload Files'}</span>
          </button>

          <button
            type="button"
            onClick={handleRefresh}
            title="Refresh drive"
            style={driveStyles.iconBtn}
          >
            <IconRefresh size={15} />
          </button>
        </div>
      </header>

      {/* DRAG & DROP OVERLAY */}
      {dragActive && (
        <div
          style={driveStyles.dragOverlay}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div style={driveStyles.dragBox}>
            <div style={driveStyles.dragIconBox}>
              <IconUpload size={36} />
            </div>
            <h3 style={{ margin: '0 0 6px', fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
              Drop files to upload instantly
            </h3>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#f472b6', fontFamily: 'monospace' }}>
              Target Destination: /{currentFolder || 'root'}
            </p>
          </div>
        </div>
      )}

      {/* 2. DUAL PANE LAYOUT */}
      <div style={driveStyles.mainLayout}>
        {/* SIDEBAR */}
        <aside style={driveStyles.sidebar}>
          {/* STORAGE ROOT */}
          <div style={driveStyles.sidebarSection}>
            <span style={driveStyles.sectionHeader}>Storage Root</span>
            <button
              type="button"
              onClick={() => navigateToFolder('')}
              style={{
                ...driveStyles.navItem,
                ...(currentFolder === '' ? driveStyles.activeNavItem : {}),
              }}
            >
              <IconHome size={16} style={{ color: currentFolder === '' ? '#f472b6' : '#64748b' }} />
              <span>Root Storage</span>
            </button>
          </div>

          {/* RESOURCE TYPE SELECTOR */}
          <div style={driveStyles.sidebarSection}>
            <span style={driveStyles.sectionHeader}>Resource Category</span>
            {[
              { id: 'image', label: 'Images', icon: IconImage, color: '#38bdf8' },
              { id: 'video', label: 'Videos & Audio', icon: IconVideo, color: '#c084fc' },
              { id: 'raw', label: 'Documents / Raw', icon: IconFile, color: '#fbbf24' },
            ].map((cat) => {
              const Icon = cat.icon;
              const isActive = resourceType === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setResourceType(cat.id)}
                  style={{
                    ...driveStyles.navItem,
                    ...(isActive ? driveStyles.activeCatItem : {}),
                  }}
                >
                  <Icon size={16} style={{ color: cat.color }} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* FOLDER QUICK LIST */}
          <div style={{ ...driveStyles.sidebarSection, flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={driveStyles.sectionHeader}>Folders ({folders.length})</span>
              <button
                type="button"
                onClick={() => setIsNewFolderOpen(true)}
                style={driveStyles.miniPlusBtn}
                title="Create Subfolder"
              >
                <IconPlus size={13} />
              </button>
            </div>

            {loadingFolders ? (
              <p style={{ fontSize: '0.78rem', color: '#64748b', padding: '4px 8px', margin: 0 }}>Loading folders...</p>
            ) : folders.length === 0 ? (
              <p style={{ fontSize: '0.78rem', color: '#475569', padding: '4px 8px', margin: 0 }}>No subfolders</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {folders.map((f) => {
                  const isActive = currentFolder === f.path;
                  return (
                    <div
                      key={f.path}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderRadius: '8px',
                        background: isActive ? '#1e293b' : 'transparent',
                        paddingRight: '6px',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => navigateToFolder(f.path)}
                        style={{
                          ...driveStyles.navItem,
                          ...(isActive ? driveStyles.activeNavItem : {}),
                          flex: 1,
                          background: 'transparent',
                          border: 'none',
                        }}
                      >
                        <IconFolder size={15} style={{ color: isActive ? '#f472b6' : '#64748b', flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {f.name}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFolderToDelete(f);
                        }}
                        style={driveStyles.miniTrashBtn}
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
          <div style={driveStyles.tipCard}>
            <strong style={{ color: '#fff', display: 'block', marginBottom: '2px' }}>Pro Tip:</strong>
            <p style={{ margin: 0 }}>Paste screenshots directly with <kbd style={driveStyles.kbd}>Ctrl+V</kbd> to upload instantly!</p>
          </div>
        </aside>

        {/* MAIN STAGE CONTENT */}
        <main style={driveStyles.contentArea}>
          {/* TOOLBAR & BREADCRUMBS */}
          <div style={driveStyles.toolbarCard}>
            {/* BREADCRUMB TRAIL */}
            <div style={driveStyles.breadcrumbTrail}>
              <button
                type="button"
                onClick={() => navigateToFolder('')}
                style={driveStyles.crumbBtn}
              >
                Root
              </button>
              {breadcrumbs.map((crumb, idx) => {
                const targetPath = breadcrumbs.slice(0, idx + 1).join('/');
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <span key={targetPath} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: '#475569' }}>/</span>
                    <button
                      type="button"
                      onClick={() => navigateToFolder(targetPath)}
                      style={{
                        ...driveStyles.crumbBtn,
                        ...(isLast ? { color: '#f472b6', fontWeight: 'bold' } : {}),
                      }}
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
                  style={driveStyles.deleteCurrentFolderBtn}
                  title="Delete current folder"
                >
                  <IconTrash size={12} />
                  <span>Delete Folder</span>
                </button>
              )}
            </div>

            {/* SEARCH & CONTROLS */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <div style={driveStyles.searchBox}>
                <IconSearch size={14} style={{ color: '#64748b' }} />
                <input
                  type="text"
                  placeholder="Search assets (ext:webm, older:30d)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={driveStyles.searchInput}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    style={driveStyles.clearSearchBtn}
                  >
                    <IconClose size={13} />
                  </button>
                )}
              </div>

              {/* SORT DROPDOWN */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={driveStyles.sortSelect}
              >
                <option value="created-desc">Newest First</option>
                <option value="created-asc">Oldest First</option>
                <option value="size-desc">Size (Large → Small)</option>
                <option value="size-asc">Size (Small → Large)</option>
                <option value="name-asc">Name (A → Z)</option>
              </select>

              {/* VIEW SWITCHER */}
              <div style={driveStyles.viewSwitchGroup}>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  style={{
                    ...driveStyles.viewBtn,
                    ...(viewMode === 'grid' ? driveStyles.activeViewBtn : {}),
                  }}
                  title="Grid View"
                >
                  <IconGrid size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  style={{
                    ...driveStyles.viewBtn,
                    ...(viewMode === 'list' ? driveStyles.activeViewBtn : {}),
                  }}
                  title="List View"
                >
                  <IconList size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* QUICK QUERY CHIP BUTTONS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748b' }}>
              Quick Filters:
            </span>
            {[
              { label: 'Older than 90D', query: 'older:90d' },
              { label: 'Older than 30D', query: 'older:30d' },
              { label: 'user-uploads', query: 'folder:user-uploads' },
              { label: 'Voice Notes (.webm)', query: 'ext:webm' },
              { label: 'PNG Images', query: 'ext:png' },
              { label: 'Large Files (>2MB)', query: 'size:>2mb' },
            ].map((chip) => {
              const isActive = searchQuery === chip.query;
              return (
                <button
                  key={chip.query}
                  type="button"
                  onClick={() => setSearchQuery(isActive ? '' : chip.query)}
                  style={{
                    ...driveStyles.filterChip,
                    ...(isActive ? driveStyles.activeFilterChip : {}),
                  }}
                >
                  {chip.label}
                </button>
              );
            })}

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ ...driveStyles.filterChip, background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
              >
                Clear Query
              </button>
            )}
          </div>

          {/* FLOATING BULK ACTIONS BAR */}
          {selectedIds.size > 0 && (
            <div style={driveStyles.bulkRibbon}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  style={driveStyles.checkbox}
                />
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fff' }}>
                  {selectedIds.size} of {filteredResources.length} items selected
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleBulkCopy}
                  style={driveStyles.secondaryBtn}
                >
                  <IconCopy size={13} />
                  <span>Copy URLs ({selectedIds.size})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsBulkDeleteModalOpen(true)}
                  style={{ ...driveStyles.primaryBtn, background: '#dc2626' }}
                >
                  <IconTrash size={13} />
                  <span>Delete Selected ({selectedIds.size})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedIds(new Set())}
                  style={driveStyles.clearSearchBtn}
                  title="Deselect all"
                >
                  <IconClose size={15} />
                </button>
              </div>
            </div>
          )}

          {/* FOLDERS GRID */}
          {filteredFolders.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#94a3b8' }}>
                Folders ({filteredFolders.length})
              </span>
              <div style={driveStyles.folderGrid}>
                {filteredFolders.map((f) => (
                  <div
                    key={f.path}
                    onClick={() => navigateToFolder(f.path)}
                    style={driveStyles.folderCard}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                      <div style={driveStyles.folderIconBadge}>
                        <IconFolder size={18} />
                      </div>
                      <span style={driveStyles.folderName}>{f.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFolderToDelete(f);
                      }}
                      style={driveStyles.folderDeleteBtn}
                      title={`Delete folder "${f.name}"`}
                    >
                      <IconTrash size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ASSETS SECTION (GRID OR LIST) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#cbd5e1' }}>
                  Files ({filteredResources.length})
                </span>
                {filteredResources.length > 0 && (
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    style={driveStyles.selectAllBtn}
                  >
                    {isAllSelected ? 'Deselect All' : 'Select All'}
                  </button>
                )}
              </div>
            </div>

            {loadingResources ? (
              <div style={driveStyles.emptyBox}>
                <div style={{ width: '36px', height: '36px', border: '3px solid #1e293b', borderTopColor: '#ec4899', borderRadius: '50%', animation: 'drive-spin 0.8s linear infinite', margin: '0 auto 12px' }} />
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>Loading files from Cloudinary storage...</p>
              </div>
            ) : filteredResources.length === 0 ? (
              <div style={driveStyles.emptyBox}>
                <div style={driveStyles.emptyIconCircle}>
                  <IconFile size={26} />
                </div>
                <h3 style={{ margin: '0 0 4px', fontSize: '0.95rem', fontWeight: 700, color: '#f1f5f9' }}>
                  {searchQuery ? `No files matching "${searchQuery}"` : 'No files in this folder'}
                </h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
                  Drag &amp; drop files here or paste screenshots with <kbd style={driveStyles.kbd}>Ctrl+V</kbd>.
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              /* GRID VIEW */
              <div style={driveStyles.assetGrid}>
                {filteredResources.map((item, idx) => {
                  const fileName = getFileName(item.public_id);
                  const isSelected = selectedIds.has(item.public_id);
                  const isAudio = item.format === 'webm' || item.format === 'mp3' || item.format === 'wav';

                  return (
                    <div
                      key={item.public_id}
                      style={{
                        ...driveStyles.assetCard,
                        ...(isSelected ? driveStyles.selectedAssetCard : {}),
                      }}
                    >
                      {/* THUMBNAIL / MEDIA PREVIEW */}
                      <div
                        style={driveStyles.thumbnailContainer}
                        onClick={() => setPreviewIndex(idx)}
                      >
                        {/* SELECT CHECKBOX OVERLAY */}
                        <div
                          style={driveStyles.checkboxOverlay}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSelect(item.public_id);
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            style={driveStyles.checkbox}
                          />
                        </div>

                        {isAudio ? (
                          <InlineAudioCardPlayer src={item.secure_url} />
                        ) : item.resource_type === 'image' ? (
                          <img
                            src={item.secure_url}
                            alt={fileName}
                            loading="lazy"
                            style={driveStyles.gridImage}
                          />
                        ) : item.resource_type === 'video' ? (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: '#c084fc' }}>
                            <IconVideo size={36} />
                            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{item.format}</span>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: '#fbbf24' }}>
                            <IconFile size={36} />
                            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{item.format || 'RAW'}</span>
                          </div>
                        )}

                        <span style={driveStyles.formatPill}>{item.format || 'file'}</span>
                      </div>

                      {/* DETAILS & ACTIONS */}
                      <div style={driveStyles.cardContent}>
                        <div>
                          <p style={driveStyles.assetTitle} title={item.public_id}>
                            {fileName}
                          </p>
                          <div style={driveStyles.assetMeta}>
                            <span>{formatBytes(item.bytes)}</span>
                            {item.width && item.height && <span>• {item.width}×{item.height}</span>}
                          </div>
                        </div>

                        {/* ACTIONS TOOLBAR */}
                        <div style={driveStyles.cardActions}>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(item.secure_url)}
                            style={driveStyles.cardActionBtn}
                            title="Copy Direct URL"
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
                            style={driveStyles.miniIconBtn}
                            title="Rename"
                          >
                            <IconEdit size={12} />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteItem(item)}
                            style={{ ...driveStyles.miniIconBtn, color: '#f87171' }}
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
              <div style={driveStyles.tableContainer}>
                <table style={driveStyles.table}>
                  <thead>
                    <tr style={driveStyles.thRow}>
                      <th style={{ ...driveStyles.th, width: '40px' }}>
                        <input
                          type="checkbox"
                          checked={isAllSelected}
                          onChange={toggleSelectAll}
                          style={driveStyles.checkbox}
                        />
                      </th>
                      <th style={driveStyles.th}>Asset Name / Public ID</th>
                      <th style={driveStyles.th}>Format</th>
                      <th style={driveStyles.th}>Size</th>
                      <th style={driveStyles.th}>Dimensions</th>
                      <th style={driveStyles.th}>Created Date</th>
                      <th style={{ ...driveStyles.th, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResources.map((item, idx) => {
                      const fileName = getFileName(item.public_id);
                      const isSelected = selectedIds.has(item.public_id);

                      return (
                        <tr
                          key={item.public_id}
                          style={{
                            ...driveStyles.tr,
                            ...(isSelected ? { background: 'rgba(236, 72, 153, 0.08)' } : {}),
                          }}
                        >
                          <td style={driveStyles.td}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelect(item.public_id)}
                              style={driveStyles.checkbox}
                            />
                          </td>
                          <td style={driveStyles.td}>
                            <div
                              style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                              onClick={() => setPreviewIndex(idx)}
                            >
                              {item.resource_type === 'image' ? (
                                <img
                                  src={item.secure_url}
                                  alt=""
                                  style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover', background: '#090d16' }}
                                />
                              ) : item.resource_type === 'video' ? (
                                <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'rgba(192, 132, 252, 0.15)', color: '#c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <IconVideo size={16} />
                                </div>
                              ) : (
                                <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <IconFile size={16} />
                                </div>
                              )}
                              <div>
                                <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.82rem' }}>{fileName}</div>
                                <div style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'monospace' }}>{item.public_id}</div>
                              </div>
                            </div>
                          </td>
                          <td style={driveStyles.td}>
                            <span style={driveStyles.tableBadge}>{item.format || item.resource_type}</span>
                          </td>
                          <td style={{ ...driveStyles.td, color: '#cbd5e1', fontWeight: 600 }}>{formatBytes(item.bytes)}</td>
                          <td style={{ ...driveStyles.td, color: '#94a3b8' }}>
                            {item.width && item.height ? `${item.width} × ${item.height}` : '—'}
                          </td>
                          <td style={{ ...driveStyles.td, color: '#94a3b8' }}>
                            {item.created_at ? new Date(item.created_at).toLocaleDateString() : '—'}
                          </td>
                          <td style={{ ...driveStyles.td, textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(item.secure_url)}
                                style={driveStyles.cardActionBtn}
                              >
                                Copy
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setRenameItem(item);
                                  setNewPublicId(item.public_id);
                                }}
                                style={driveStyles.miniIconBtn}
                                title="Rename"
                              >
                                <IconEdit size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteItem(item)}
                                style={{ ...driveStyles.miniIconBtn, color: '#f87171' }}
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

      {/* 3. MODAL: ASSET PREVIEW LIGHTBOX */}
      {previewItem && (
        <div style={driveStyles.modalBackdrop} onClick={() => setPreviewIndex(null)}>
          <div style={driveStyles.lightboxCard} onClick={(e) => e.stopPropagation()}>
            {/* HEADER */}
            <div style={driveStyles.lightboxHeader}>
              <div style={{ overflow: 'hidden', paddingRight: '12px' }}>
                <h4 style={{ margin: '0 0 2px', fontSize: '0.9rem', fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {getFileName(previewItem.public_id)}
                </h4>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {previewItem.public_id}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setPreviewIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filteredResources.length - 1))}
                  style={driveStyles.navArrowBtn}
                  title="Previous (Left Arrow)"
                >
                  <IconChevronLeft size={16} />
                </button>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                  {previewIndex + 1} / {filteredResources.length}
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewIndex((prev) => (prev + 1 < filteredResources.length ? prev + 1 : 0))}
                  style={driveStyles.navArrowBtn}
                  title="Next (Right Arrow)"
                >
                  <IconChevronRight size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewIndex(null)}
                  style={driveStyles.closeModalBtn}
                >
                  <IconClose size={18} />
                </button>
              </div>
            </div>

            {/* PREVIEW STAGE */}
            <div style={driveStyles.lightboxBody}>
              {previewItem.format === 'webm' || previewItem.format === 'mp3' || previewItem.format === 'wav' ? (
                <div style={{ width: '100%', maxWidth: '420px', padding: '24px', background: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b', textAlign: 'center' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(236,72,153,0.15)', color: '#f472b6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <IconMic size={28} />
                  </div>
                  <h5 style={{ margin: '0 0 2px', fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>
                    {getFileName(previewItem.public_id)}
                  </h5>
                  <p style={{ margin: '0 0 16px', fontSize: '0.75rem', color: '#f472b6', fontFamily: 'monospace' }}>
                    Voice Note ({previewItem.format})
                  </p>
                  <audio src={previewItem.secure_url} controls autoPlay style={{ width: '100%' }} />
                </div>
              ) : previewItem.resource_type === 'video' ? (
                <video src={previewItem.secure_url} controls autoPlay style={{ maxHeight: '50vh', maxWidth: '100%', borderRadius: '10px' }} />
              ) : (
                <img
                  src={previewItem.secure_url}
                  alt={previewItem.public_id}
                  style={{ maxHeight: '50vh', maxWidth: '100%', borderRadius: '10px', objectFit: 'contain' }}
                />
              )}
            </div>

            {/* METADATA & EMBED TOOLBAR */}
            <div style={driveStyles.lightboxFooter}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem', color: '#94a3b8', flexWrap: 'wrap' }}>
                <span>Size: <strong style={{ color: '#fff' }}>{formatBytes(previewItem.bytes)}</strong></span>
                {previewItem.width && previewItem.height && (
                  <span>Dimensions: <strong style={{ color: '#fff' }}>{previewItem.width}×{previewItem.height}</strong></span>
                )}
                <span>Created: <strong style={{ color: '#fff' }}>{new Date(previewItem.created_at).toLocaleDateString()}</strong></span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => copyToClipboard(`![${getFileName(previewItem.public_id)}](${previewItem.secure_url})`, 'Markdown code')}
                  style={driveStyles.secondaryBtn}
                >
                  Copy Markdown
                </button>

                <button
                  type="button"
                  onClick={() => copyToClipboard(previewItem.secure_url, 'Direct URL')}
                  style={driveStyles.secondaryBtn}
                >
                  <IconCopy size={13} />
                  <span>Copy URL</span>
                </button>

                <a
                  href={previewItem.secure_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={driveStyles.primaryBtn}
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
        <div style={driveStyles.modalBackdrop}>
          <div style={driveStyles.dialogCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={driveStyles.folderIconBadge}>
                <IconFolder size={20} />
              </div>
              <div>
                <h3 style={{ margin: '0 0 2px', fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>Create New Folder</h3>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8' }}>Target: /{currentFolder || 'root'}</p>
              </div>
            </div>

            <form onSubmit={handleCreateFolder} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
              <input
                type="text"
                placeholder="e.g. banners, user-uploads"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                style={driveStyles.dialogInput}
                autoFocus
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsNewFolderOpen(false)}
                  style={driveStyles.secondaryBtn}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingFolder || !newFolderName.trim()}
                  style={driveStyles.primaryBtn}
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
        <div style={driveStyles.modalBackdrop}>
          <div style={driveStyles.dialogCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ ...driveStyles.folderIconBadge, background: 'rgba(56,189,248,0.15)', color: '#38bdf8' }}>
                <IconEdit size={20} />
              </div>
              <div style={{ overflow: 'hidden' }}>
                <h3 style={{ margin: '0 0 2px', fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>Rename Asset</h3>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {renameItem.public_id}
                </p>
              </div>
            </div>

            <form onSubmit={handleRename} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
              <input
                type="text"
                placeholder="New Public ID"
                value={newPublicId}
                onChange={(e) => setNewPublicId(e.target.value)}
                style={{ ...driveStyles.dialogInput, fontFamily: 'monospace' }}
                autoFocus
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setRenameItem(null)}
                  style={driveStyles.secondaryBtn}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={renaming || !newPublicId.trim()}
                  style={{ ...driveStyles.primaryBtn, background: '#0284c7' }}
                >
                  {renaming ? 'Renaming...' : 'Rename Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL: DELETE SINGLE ASSET */}
      {deleteItem && (
        <div style={driveStyles.modalBackdrop}>
          <div style={driveStyles.dialogCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f87171' }}>
              <div style={{ ...driveStyles.folderIconBadge, background: 'rgba(239,68,68,0.15)', color: '#f87171' }}>
                <IconTrash size={20} />
              </div>
              <div>
                <h3 style={{ margin: '0 0 2px', fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>Delete Asset</h3>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#f87171' }}>Permanent Removal</p>
              </div>
            </div>

            <p style={{ margin: '12px 0 6px', fontSize: '0.8rem', color: '#cbd5e1' }}>
              Are you sure you want to permanently delete this asset from Cloudinary?
            </p>

            <div style={{ padding: '8px 12px', borderRadius: '8px', background: '#070b14', border: '1px solid #1e293b', fontSize: '0.75rem', fontFamily: 'monospace', color: '#fca5a5', wordBreak: 'break-all' }}>
              {deleteItem.public_id}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '14px' }}>
              <button
                type="button"
                onClick={() => setDeleteItem(null)}
                style={driveStyles.secondaryBtn}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                style={{ ...driveStyles.primaryBtn, background: '#dc2626' }}
              >
                {deleting ? 'Deleting...' : 'Permanently Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. MODAL: DELETE FOLDER */}
      {folderToDelete && (
        <div style={driveStyles.modalBackdrop}>
          <div style={driveStyles.dialogCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f87171' }}>
              <div style={{ ...driveStyles.folderIconBadge, background: 'rgba(239,68,68,0.15)', color: '#f87171' }}>
                <IconTrash size={20} />
              </div>
              <div>
                <h3 style={{ margin: '0 0 2px', fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>Delete Folder</h3>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#f87171' }}>Recursive Removal</p>
              </div>
            </div>

            <p style={{ margin: '12px 0 6px', fontSize: '0.8rem', color: '#cbd5e1' }}>
              Permanently delete folder <strong style={{ color: '#fff' }}>&quot;{folderToDelete.name}&quot;</strong> and all assets inside it?
            </p>

            <div style={{ padding: '8px 12px', borderRadius: '8px', background: '#070b14', border: '1px solid #1e293b', fontSize: '0.75rem', fontFamily: 'monospace', color: '#fca5a5', wordBreak: 'break-all' }}>
              Path: {folderToDelete.path}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '14px' }}>
              <button
                type="button"
                onClick={() => setFolderToDelete(null)}
                style={driveStyles.secondaryBtn}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteFolder}
                disabled={deletingFolder}
                style={{ ...driveStyles.primaryBtn, background: '#dc2626' }}
              >
                {deletingFolder ? 'Deleting...' : 'Permanently Delete Folder'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. MODAL: BULK DELETE */}
      {isBulkDeleteModalOpen && (
        <div style={driveStyles.modalBackdrop}>
          <div style={{ ...driveStyles.dialogCard, maxWidth: '440px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f87171' }}>
              <div style={{ ...driveStyles.folderIconBadge, background: 'rgba(239,68,68,0.15)', color: '#f87171' }}>
                <IconTrash size={20} />
              </div>
              <div>
                <h3 style={{ margin: '0 0 2px', fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>
                  Delete {selectedIds.size} Selected Assets
                </h3>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#f87171' }}>Irreversible Batch Removal</p>
              </div>
            </div>

            <p style={{ margin: '12px 0 6px', fontSize: '0.8rem', color: '#cbd5e1' }}>
              Permanently delete the selected <strong style={{ color: '#fff' }}>{selectedIds.size}</strong> assets from Cloudinary?
            </p>

            <div style={{ maxHeight: '140px', overflowY: 'auto', padding: '10px', borderRadius: '8px', background: '#070b14', border: '1px solid #1e293b', fontSize: '0.75rem', fontFamily: 'monospace', color: '#fca5a5', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {Array.from(selectedIds).map((id) => (
                <div key={id} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>• {id}</div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '14px' }}>
              <button
                type="button"
                onClick={() => setIsBulkDeleteModalOpen(false)}
                style={driveStyles.secondaryBtn}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => executeBatchDelete(Array.from(selectedIds))}
                disabled={bulkDeleting}
                style={{ ...driveStyles.primaryBtn, background: '#dc2626' }}
              >
                {bulkDeleting ? 'Deleting...' : `Delete ${selectedIds.size} Assets`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. TOAST SYSTEM */}
      {toast && (
        <div style={{ ...driveStyles.toastBox, background: toast.type === 'error' ? '#991b1b' : '#831843', borderColor: toast.type === 'error' ? '#dc2626' : '#db2777' }}>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

// ==========================================
// CSS STYLESHEET (CLEAN, SELF-CONTAINED & ROBUST)
// ==========================================
const driveCSS = `
  @keyframes drive-spin {
    to { transform: rotate(360deg); }
  }
  @keyframes drive-pulse {
    0% { height: 6px; }
    100% { height: 16px; }
  }
`;

const driveStyles = {
  container: {
    height: '100vh',
    maxHeight: '100vh',
    background: '#070b14',
    color: '#f1f5f9',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxSizing: 'border-box',
  },
  header: {
    background: '#0c1220',
    borderBottom: '1px solid #1e293b',
    padding: '12px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 0,
    zIndex: 20,
    flexWrap: 'wrap',
    gap: '12px',
  },
  brandGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  backBtn: {
    padding: '6px 12px',
    borderRadius: '8px',
    background: '#1e293b',
    color: '#cbd5e1',
    textDecoration: 'none',
    fontSize: '0.78rem',
    fontWeight: 600,
    border: '1px solid #334155',
  },
  logoBadge: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #ec4899 0%, #be123c 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)',
  },
  title: {
    margin: 0,
    fontSize: '1.05rem',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    color: '#fff',
  },
  proBadge: {
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '0.65rem',
    fontWeight: 800,
    fontFamily: 'monospace',
    background: 'rgba(236, 72, 153, 0.15)',
    color: '#f472b6',
    border: '1px solid rgba(236, 72, 153, 0.3)',
  },
  subtitle: {
    margin: 0,
    fontSize: '0.72rem',
    color: '#94a3b8',
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  expirationBtn: {
    padding: '7px 14px',
    borderRadius: '8px',
    background: 'rgba(244, 63, 94, 0.12)',
    color: '#fda4af',
    fontSize: '0.78rem',
    fontWeight: 700,
    border: '1px solid rgba(244, 63, 94, 0.3)',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },
  secondaryBtn: {
    padding: '7px 14px',
    borderRadius: '8px',
    background: '#1e293b',
    color: '#e2e8f0',
    fontSize: '0.78rem',
    fontWeight: 600,
    border: '1px solid #334155',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    textDecoration: 'none',
  },
  primaryBtn: {
    padding: '7px 16px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #ec4899 0%, #be123c 100%)',
    color: '#fff',
    fontSize: '0.78rem',
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: '0 2px 10px rgba(236, 72, 153, 0.35)',
    textDecoration: 'none',
  },
  iconBtn: {
    width: '34px',
    height: '34px',
    borderRadius: '8px',
    background: '#1e293b',
    border: '1px solid #334155',
    color: '#cbd5e1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  mainLayout: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  sidebar: {
    width: '240px',
    background: '#090e1a',
    borderRight: '1px solid #1e293b',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    overflowY: 'auto',
    flexShrink: 0,
    boxSizing: 'border-box',
  },
  sidebarSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  sectionHeader: {
    fontSize: '0.68rem',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: '#64748b',
    padding: '0 4px',
  },
  navItem: {
    background: 'transparent',
    border: 'none',
    color: '#94a3b8',
    padding: '8px 10px',
    borderRadius: '8px',
    fontSize: '0.78rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textAlign: 'left',
    width: '100%',
  },
  activeNavItem: {
    background: '#1e293b',
    color: '#f472b6',
    fontWeight: 700,
  },
  activeCatItem: {
    background: '#1e293b',
    color: '#fff',
    fontWeight: 700,
  },
  miniPlusBtn: {
    background: '#1e293b',
    border: '1px solid #334155',
    color: '#94a3b8',
    width: '20px',
    height: '20px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: 0,
  },
  miniTrashBtn: {
    background: 'transparent',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    padding: '2px 4px',
    display: 'flex',
  },
  tipCard: {
    background: '#0e1526',
    border: '1px solid #1e293b',
    borderRadius: '10px',
    padding: '10px 12px',
    fontSize: '0.72rem',
    color: '#94a3b8',
  },
  kbd: {
    background: '#1e293b',
    padding: '2px 6px',
    borderRadius: '4px',
    fontFamily: 'monospace',
    color: '#f472b6',
  },
  contentArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 24px',
    overflowY: 'auto',
    gap: '16px',
    boxSizing: 'border-box',
  },
  toolbarCard: {
    background: '#0c1220',
    border: '1px solid #1e293b',
    borderRadius: '12px',
    padding: '10px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
  },
  breadcrumbTrail: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#94a3b8',
    flexWrap: 'wrap',
  },
  crumbBtn: {
    background: 'transparent',
    border: 'none',
    color: '#cbd5e1',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: 600,
    padding: '2px 4px',
  },
  deleteCurrentFolderBtn: {
    background: 'rgba(239, 68, 68, 0.12)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#f87171',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '0.72rem',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    marginLeft: '6px',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#070b14',
    border: '1px solid #334155',
    borderRadius: '8px',
    padding: '6px 12px',
  },
  searchInput: {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#f8fafc',
    fontSize: '0.78rem',
    width: '200px',
  },
  clearSearchBtn: {
    background: 'transparent',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
  },
  sortSelect: {
    background: '#070b14',
    border: '1px solid #334155',
    borderRadius: '8px',
    padding: '6px 10px',
    color: '#cbd5e1',
    fontSize: '0.78rem',
    outline: 'none',
    cursor: 'pointer',
  },
  viewSwitchGroup: {
    display: 'flex',
    background: '#070b14',
    border: '1px solid #334155',
    borderRadius: '8px',
    padding: '2px',
  },
  viewBtn: {
    background: 'transparent',
    border: 'none',
    color: '#64748b',
    padding: '4px 8px',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeViewBtn: {
    background: '#1e293b',
    color: '#f472b6',
  },
  filterChip: {
    background: '#0e1526',
    border: '1px solid #1e293b',
    color: '#94a3b8',
    padding: '5px 10px',
    borderRadius: '8px',
    fontSize: '0.75rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  activeFilterChip: {
    background: 'rgba(236, 72, 153, 0.15)',
    color: '#f472b6',
    borderColor: 'rgba(236, 72, 153, 0.35)',
  },
  bulkRibbon: {
    background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(15, 23, 42, 0.9) 100%)',
    border: '1px solid rgba(236, 72, 153, 0.4)',
    borderRadius: '12px',
    padding: '12px 18px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  folderGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '10px',
  },
  folderCard: {
    background: '#0c1220',
    border: '1px solid #1e293b',
    borderRadius: '10px',
    padding: '10px 12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
  },
  folderIconBadge: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'rgba(236, 72, 153, 0.12)',
    color: '#f472b6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  folderName: {
    fontSize: '0.82rem',
    fontWeight: 700,
    color: '#f8fafc',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  folderDeleteBtn: {
    background: 'transparent',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
  },
  assetGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
    gap: '14px',
  },
  assetCard: {
    background: '#0e1526',
    border: '1px solid #1e293b',
    borderRadius: '14px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  selectedAssetCard: {
    borderColor: '#ec4899',
    boxShadow: '0 0 0 2px rgba(236, 72, 153, 0.3)',
    background: '#131b2e',
  },
  thumbnailContainer: {
    position: 'relative',
    height: '140px',
    background: '#070b14',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    overflow: 'hidden',
  },
  gridImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  checkboxOverlay: {
    position: 'absolute',
    top: '8px',
    left: '8px',
    zIndex: 10,
  },
  checkbox: {
    cursor: 'pointer',
    width: '16px',
    height: '16px',
  },
  formatPill: {
    position: 'absolute',
    bottom: '8px',
    right: '8px',
    background: 'rgba(0, 0, 0, 0.75)',
    color: '#cbd5e1',
    fontSize: '0.65rem',
    fontFamily: 'monospace',
    fontWeight: 700,
    padding: '2px 6px',
    borderRadius: '4px',
    textTransform: 'uppercase',
  },
  cardContent: {
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '8px',
    flex: 1,
  },
  assetTitle: {
    margin: 0,
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#f8fafc',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  assetMeta: {
    fontSize: '0.72rem',
    color: '#94a3b8',
    marginTop: '2px',
  },
  cardActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    borderTop: '1px solid #1e293b',
    paddingTop: '8px',
  },
  cardActionBtn: {
    flex: 1,
    padding: '4px 8px',
    borderRadius: '6px',
    background: '#1e293b',
    border: '1px solid #334155',
    color: '#cbd5e1',
    fontSize: '0.72rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
  },
  miniIconBtn: {
    padding: '5px',
    borderRadius: '6px',
    background: '#1e293b',
    border: '1px solid #334155',
    color: '#94a3b8',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectAllBtn: {
    background: '#1e293b',
    border: '1px solid #334155',
    color: '#94a3b8',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '0.72rem',
    cursor: 'pointer',
  },
  tableContainer: {
    background: '#0c1220',
    border: '1px solid #1e293b',
    borderRadius: '14px',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    fontSize: '0.78rem',
  },
  thRow: {
    background: '#090e1a',
    borderBottom: '1px solid #1e293b',
  },
  th: {
    padding: '12px 16px',
    fontSize: '0.72rem',
    fontWeight: 700,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  tr: {
    borderBottom: '1px solid rgba(30, 41, 59, 0.6)',
  },
  td: {
    padding: '12px 16px',
    color: '#cbd5e1',
  },
  tableBadge: {
    background: 'rgba(236, 72, 153, 0.15)',
    color: '#f472b6',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '0.7rem',
    fontWeight: 700,
    fontFamily: 'monospace',
    textTransform: 'uppercase',
  },
  emptyBox: {
    padding: '60px 20px',
    textAlign: 'center',
    background: 'rgba(12, 18, 32, 0.5)',
    borderRadius: '16px',
    border: '1px solid #1e293b',
  },
  emptyIconCircle: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: '#1e293b',
    color: '#64748b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 12px',
  },
  dragOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(7, 11, 20, 0.85)',
    backdropFilter: 'blur(6px)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
  },
  dragBox: {
    border: '3px dashed #ec4899',
    borderRadius: '24px',
    padding: '48px',
    textAlign: 'center',
    background: 'rgba(236, 72, 153, 0.08)',
    maxWidth: '460px',
    width: '100%',
  },
  dragIconBox: {
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    background: 'rgba(236, 72, 153, 0.2)',
    color: '#f472b6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
  },
  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.85)',
    backdropFilter: 'blur(6px)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  lightboxCard: {
    background: '#0e1526',
    border: '1px solid #334155',
    borderRadius: '18px',
    maxWidth: '850px',
    width: '100%',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7)',
  },
  lightboxHeader: {
    padding: '14px 20px',
    borderBottom: '1px solid #1e293b',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navArrowBtn: {
    background: '#1e293b',
    border: '1px solid #334155',
    color: '#cbd5e1',
    borderRadius: '6px',
    padding: '4px 8px',
    cursor: 'pointer',
    display: 'flex',
  },
  closeModalBtn: {
    background: 'transparent',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
  },
  lightboxBody: {
    padding: '24px',
    background: '#070b14',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '300px',
    maxHeight: '55vh',
    overflow: 'auto',
  },
  lightboxFooter: {
    padding: '14px 20px',
    borderTop: '1px solid #1e293b',
    background: '#0c1220',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
  },
  dialogCard: {
    background: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '16px',
    maxWidth: '380px',
    width: '100%',
    padding: '20px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
  },
  dialogInput: {
    width: '100%',
    background: '#070b14',
    border: '1px solid #334155',
    borderRadius: '8px',
    padding: '8px 12px',
    color: '#fff',
    fontSize: '0.82rem',
    outline: 'none',
    boxSizing: 'border-box',
  },
  toastBox: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 1100,
    padding: '12px 20px',
    borderRadius: '10px',
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.82rem',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
    border: '1px solid',
  },
};
