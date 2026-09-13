'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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

  // Search & View
  const [searchQuery, setSearchQuery] = useState('');
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

  const [previewItem, setPreviewItem] = useState(null);

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

  // Delete Folder and its contents
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
  const handleFileUpload = useCallback(async (files) => {
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
  }, [currentFolder, fetchResources]);

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
      fetchResources();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Execute Batch Delete (Bulk or Query)
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

  // Multi-Select handlers
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

  const isAllSelected =
    resources.length > 0 && selectedIds.size === resources.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      const allIds = resources.map((r) => r.public_id);
      setSelectedIds(new Set(allIds));
    }
  };

  // Copy Single or Bulk URLs
  const copyToClipboard = (text, label = 'Direct link') => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`);
  };

  const handleBulkCopy = () => {
    const selectedUrls = resources
      .filter((r) => selectedIds.has(r.public_id))
      .map((r) => r.secure_url)
      .join('\n');

    if (selectedUrls) {
      copyToClipboard(selectedUrls, `${selectedIds.size} URL(s)`);
    }
  };

  // Query and Folder filtering
  const filteredResources = resources.filter((item) => {
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

      const fileName = getFileName(item.public_id).toLowerCase();
      const fullId = item.public_id.toLowerCase();
      return fileName.includes(lowerToken) || fullId.includes(lowerToken);
    });
  });

  const filteredFolders = folders.filter((f) => {
    if (!searchQuery.trim()) return true;
    return f.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
  });

  // Helpers
  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileName = (publicId) => {
    const parts = publicId.split('/');
    return parts[parts.length - 1];
  };

  if (authLoading || checkingAuth) {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.spinner} />
        <p style={{ color: '#94a3b8', fontWeight: 600 }}>Loading Cloudinary Drive...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div style={styles.container} onDragEnter={handleDrag}>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        multiple
        style={{ display: 'none' }}
        onChange={(e) => handleFileUpload(e.target.files)}
      />

      {/* TOP HEADER */}
      <header style={styles.header}>
        <div style={styles.brandGroup}>
          <Link href="/admin/dashboard" style={styles.backLink} title="Back to Admin Dashboard">
            ← Admin
          </Link>
          <div style={styles.logoBadge}>
            <IconCloud size={20} />
          </div>
          <div>
            <h1 style={styles.title}>Cloudinary Drive</h1>
            <p style={styles.subtitle}>Asset Storage & Hosting Manager</p>
          </div>
        </div>

        {/* Action Controls */}
        <div style={styles.headerActions}>
          <button
            type="button"
            onClick={() => setIsNewFolderOpen(true)}
            style={styles.secondaryBtn}
          >
            <IconPlus size={16} />
            <span>New Folder</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            style={styles.primaryBtn}
          >
            <IconUpload size={16} />
            <span>{uploading ? `Uploading (${uploadProgress}%)` : 'Upload Files'}</span>
          </button>

          <button
            type="button"
            onClick={handleRefresh}
            title="Refresh drive"
            style={styles.iconBtn}
          >
            <IconRefresh size={16} />
          </button>
        </div>
      </header>

      {/* DRAG AND DROP OVERLAY */}
      {dragActive && (
        <div
          style={styles.dragOverlay}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div style={styles.dragBox}>
            <IconUpload size={48} />
            <h3 style={{ margin: '10px 0 4px', color: '#fff', fontSize: '1.4rem' }}>Drop files to upload</h3>
            <p style={{ color: '#f472b6', margin: 0 }}>Uploading to: /{currentFolder || 'root'}</p>
          </div>
        </div>
      )}

      {/* MAIN LAYOUT */}
      <div style={styles.mainLayout}>
        {/* SIDEBAR */}
        <aside style={styles.sidebar}>
          <div style={styles.sidebarSection}>
            <span style={styles.sectionHeader}>STORAGE SECTIONS</span>
            <button
              type="button"
              onClick={() => navigateToFolder('')}
              style={{
                ...styles.navItem,
                ...(currentFolder === '' ? styles.activeNavItem : {}),
              }}
            >
              <IconHome size={16} />
              <span>Root Folder</span>
            </button>
          </div>

          {/* RESOURCE TYPES */}
          <div style={styles.sidebarSection}>
            <span style={styles.sectionHeader}>RESOURCE TYPES</span>
            <button
              type="button"
              onClick={() => setResourceType('image')}
              style={{
                ...styles.navItem,
                ...(resourceType === 'image' ? styles.activeNavItem : {}),
              }}
            >
              <IconImage size={16} />
              <span>Images</span>
            </button>
            <button
              type="button"
              onClick={() => setResourceType('video')}
              style={{
                ...styles.navItem,
                ...(resourceType === 'video' ? styles.activeNavItem : {}),
              }}
            >
              <IconVideo size={16} />
              <span>Videos & Audio</span>
            </button>
            <button
              type="button"
              onClick={() => setResourceType('raw')}
              style={{
                ...styles.navItem,
                ...(resourceType === 'raw' ? styles.activeNavItem : {}),
              }}
            >
              <IconFile size={16} />
              <span>Documents / Raw</span>
            </button>
          </div>

          {/* FOLDER QUICK LIST */}
          <div style={styles.sidebarSection}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={styles.sectionHeader}>FOLDERS</span>
              <button
                type="button"
                onClick={() => setIsNewFolderOpen(true)}
                style={styles.tinyBtn}
                title="Add Subfolder"
              >
                <IconPlus size={14} />
              </button>
            </div>

            {loadingFolders ? (
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Loading folders...</p>
            ) : folders.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>No subfolders</p>
            ) : (
              folders.map((f) => {
                const isActive = currentFolder === f.path;
                return (
                  <div
                    key={f.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      borderRadius: '8px',
                      background: isActive ? '#1e293b' : 'transparent',
                      paddingRight: '6px',
                      marginBottom: '2px',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => navigateToFolder(f.path)}
                      style={{
                        ...styles.navItem,
                        ...(isActive ? styles.activeNavItem : {}),
                        flex: 1,
                        textAlign: 'left',
                        background: 'transparent',
                        borderWidth: 0,
                        borderStyle: 'none',
                        marginBottom: 0,
                      }}
                    >
                      <IconFolder size={15} />
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
                      style={styles.folderDeleteIconBtn}
                      title={`Delete folder "${f.name}"`}
                    >
                      <IconTrash size={14} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* CONTENT AREA */}
        <main style={styles.content}>
          {/* TOOLBAR & BREADCRUMBS */}
          <div style={styles.toolbar}>
            {/* Breadcrumb Navigation */}
            <div style={styles.breadcrumbs}>
              <button
                type="button"
                onClick={() => navigateToFolder('')}
                style={styles.crumbBtn}
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
                        ...styles.crumbBtn,
                        ...(isLast ? { color: '#ec4899', fontWeight: 'bold' } : {}),
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
                  style={styles.deleteActiveFolderBtn}
                  title="Delete this folder and all contents"
                >
                  <IconTrash size={14} />
                  <span>Delete Folder</span>
                </button>
              )}
            </div>

            {/* Search and Layout Toggle */}
            <div style={styles.toolbarRight}>
              <div style={styles.searchBox} title="Type any keyword, folder name, or extension to run a query">
                <IconSearch size={15} />
                <input
                  type="text"
                  placeholder="Run query (e.g. user-uploads, birthday, .png)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={styles.searchInput}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    style={styles.clearSearch}
                    title="Clear query"
                  >
                    <IconClose size={14} />
                  </button>
                )}
              </div>

              {/* View Toggle */}
              <div style={styles.viewToggleGroup}>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  style={{
                    ...styles.toggleBtn,
                    ...(viewMode === 'grid' ? styles.activeToggle : {}),
                  }}
                  title="Grid View"
                >
                  <IconGrid size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  style={{
                    ...styles.toggleBtn,
                    ...(viewMode === 'list' ? styles.activeToggle : {}),
                  }}
                  title="List View"
                >
                  <IconList size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* QUICK QUERY CHIPS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Quick Queries:
            </span>
            <button
              type="button"
              onClick={() => setSearchQuery('older:90d')}
              style={{
                ...styles.chipBtn,
                ...(searchQuery === 'older:90d' ? styles.activeChipBtn : {}),
              }}
            >
              <IconClock size={13} />
              <span>Older than 90 Days</span>
            </button>
            <button
              type="button"
              onClick={() => setSearchQuery('older:30d')}
              style={{
                ...styles.chipBtn,
                ...(searchQuery === 'older:30d' ? styles.activeChipBtn : {}),
              }}
            >
              <IconCalendar size={13} />
              <span>Older than 30 Days</span>
            </button>
            <button
              type="button"
              onClick={() => setSearchQuery('folder:user-uploads')}
              style={{
                ...styles.chipBtn,
                ...(searchQuery === 'folder:user-uploads' ? styles.activeChipBtn : {}),
              }}
            >
              <IconFolder size={13} />
              <span>user-uploads</span>
            </button>
            <button
              type="button"
              onClick={() => setSearchQuery('ext:webm')}
              style={{
                ...styles.chipBtn,
                ...(searchQuery === 'ext:webm' ? styles.activeChipBtn : {}),
              }}
            >
              <IconMic size={13} />
              <span>Voice Notes (.webm)</span>
            </button>
            <button
              type="button"
              onClick={() => setSearchQuery('ext:png')}
              style={{
                ...styles.chipBtn,
                ...(searchQuery === 'ext:png' ? styles.activeChipBtn : {}),
              }}
            >
              <IconImage size={13} />
              <span>PNG Images (.png)</span>
            </button>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ ...styles.chipBtn, color: '#ef4444', borderColor: '#ef4444' }}
              >
                <IconClose size={13} />
                <span>Clear Query</span>
              </button>
            )}
          </div>

          {/* QUERY-BASED ACTION RIBBON */}
          {searchQuery.trim() !== '' && filteredResources.length > 0 && (
            <div style={styles.queryRibbon}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <IconSearch size={18} />
                <div>
                  <span style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.88rem' }}>
                    Found {filteredResources.length} items matching &quot;{searchQuery}&quot;
                  </span>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8' }}>
                    Query results across current folder
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsQueryDeleteModalOpen(true)}
                style={styles.dangerBtn}
              >
                <IconTrash size={15} />
                <span>Delete All {filteredResources.length} Matching Search</span>
              </button>
            </div>
          )}

          {/* MULTI-SELECT BULK ACTION RIBBON */}
          {selectedIds.size > 0 && (
            <div style={styles.bulkRibbon}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  style={styles.checkboxInput}
                />
                <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#fff' }}>
                  {selectedIds.size} of {filteredResources.length} selected
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleBulkCopy}
                  style={styles.secondaryBtn}
                >
                  <IconCopy size={15} />
                  <span>Copy Links ({selectedIds.size})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsBulkDeleteModalOpen(true)}
                  style={styles.dangerBtn}
                >
                  <IconTrash size={15} />
                  <span>Delete Selected ({selectedIds.size})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedIds(new Set())}
                  style={styles.clearSearch}
                  title="Deselect all"
                >
                  <IconClose size={15} />
                </button>
              </div>
            </div>
          )}

          {/* FOLDER CARDS DISPLAY */}
          {filteredFolders.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={styles.subHeading}>Folders ({filteredFolders.length})</h3>
              <div style={styles.folderGrid}>
                {filteredFolders.map((f) => (
                  <div
                    key={f.path}
                    onClick={() => navigateToFolder(f.path)}
                    style={styles.folderCard}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, overflow: 'hidden' }}>
                      <span style={{ color: '#ec4899', display: 'flex', alignItems: 'center' }}>
                        <IconFolder size={24} />
                      </span>
                      <span style={styles.folderName}>{f.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFolderToDelete(f);
                      }}
                      style={styles.folderCardDeleteBtn}
                      title={`Delete folder "${f.name}"`}
                    >
                      <IconTrash size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ASSETS SECTION */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <h3 style={styles.subHeading}>
                  Files ({filteredResources.length})
                  {resourceType !== 'image' && ` [${resourceType.toUpperCase()}]`}
                </h3>
                {filteredResources.length > 0 && (
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    style={styles.selectAllBtn}
                  >
                    {isAllSelected ? 'Deselect All' : 'Select All'}
                  </button>
                )}
              </div>
            </div>

            {loadingResources ? (
              <div style={styles.emptyState}>
                <div style={styles.spinner} />
                <p style={{ marginTop: '12px', color: '#94a3b8' }}>Loading files from Cloudinary...</p>
              </div>
            ) : filteredResources.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={{ color: '#64748b', display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                  <IconFile size={40} />
                </div>
                <p style={{ color: '#cbd5e1', fontWeight: 600, margin: '4px 0' }}>
                  {searchQuery ? `No files matching "${searchQuery}"` : 'No files found in this folder'}
                </p>
                <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
                  Drag & drop files here or click Upload Files above
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              /* GRID VIEW */
              <div style={styles.assetGrid}>
                {filteredResources.map((item) => {
                  const fileName = getFileName(item.public_id);
                  const isSelected = selectedIds.has(item.public_id);
                  return (
                    <div
                      key={item.public_id}
                      style={{
                        ...styles.assetCard,
                        ...(isSelected ? styles.selectedAssetCard : {}),
                      }}
                    >
                      {/* PREVIEW CONTAINER */}
                      <div
                        style={styles.previewContainer}
                        onClick={() => setPreviewItem(item)}
                      >
                        {/* SELECT CHECKBOX OVERLAY */}
                        <div
                          style={styles.checkboxOverlay}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSelect(item.public_id);
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            style={styles.cardCheckbox}
                          />
                        </div>

                        {item.resource_type === 'image' ? (
                          <img
                            src={item.secure_url}
                            alt={fileName}
                            style={styles.gridImg}
                            loading="lazy"
                          />
                        ) : item.resource_type === 'video' ? (
                          <div style={styles.videoPlaceholder}>
                            <IconVideo size={36} />
                            <span style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '4px' }}>
                              {item.format?.toUpperCase()}
                            </span>
                          </div>
                        ) : (
                          <div style={styles.rawPlaceholder}>
                            <IconFile size={36} />
                            <span style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '4px' }}>
                              {item.format?.toUpperCase() || 'FILE'}
                            </span>
                          </div>
                        )}

                        <span style={styles.formatBadge}>{item.format || 'file'}</span>
                      </div>

                      {/* CARD DETAILS */}
                      <div style={styles.cardDetails}>
                        <p style={styles.assetTitle} title={item.public_id}>
                          {fileName}
                        </p>
                        <div style={styles.assetMeta}>
                          <span>{formatBytes(item.bytes)}</span>
                          {item.width && item.height && (
                            <span>• {item.width}x{item.height}</span>
                          )}
                        </div>

                        {/* CARD ACTIONS */}
                        <div style={styles.cardActions}>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(item.secure_url)}
                            style={styles.actionBtn}
                            title="Copy Direct URL"
                          >
                            <IconCopy size={13} />
                            <span>Copy URL</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setRenameItem(item);
                              setNewPublicId(item.public_id);
                            }}
                            style={styles.actionBtnIcon}
                            title="Rename"
                          >
                            <IconEdit size={14} />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteItem(item)}
                            style={{ ...styles.actionBtnIcon, color: '#ef4444' }}
                            title="Delete"
                          >
                            <IconTrash size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* LIST VIEW */
              <div style={styles.listViewContainer}>
                <table style={styles.listTable}>
                  <thead>
                    <tr>
                      <th style={{ ...styles.th, width: '40px' }}>
                        <input
                          type="checkbox"
                          checked={isAllSelected}
                          onChange={toggleSelectAll}
                          style={styles.checkboxInput}
                        />
                      </th>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Type</th>
                      <th style={styles.th}>Size</th>
                      <th style={styles.th}>Dimensions</th>
                      <th style={styles.th}>Created</th>
                      <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResources.map((item) => {
                      const fileName = getFileName(item.public_id);
                      const isSelected = selectedIds.has(item.public_id);
                      return (
                        <tr
                          key={item.public_id}
                          style={{
                            ...styles.tr,
                            ...(isSelected ? { background: 'rgba(236, 72, 153, 0.08)' } : {}),
                          }}
                        >
                          <td style={styles.td}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelect(item.public_id)}
                              style={styles.checkboxInput}
                            />
                          </td>
                          <td style={styles.td}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              {item.resource_type === 'image' ? (
                                <img
                                  src={item.secure_url}
                                  alt=""
                                  style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }}
                                />
                              ) : item.resource_type === 'video' ? (
                                <span style={{ color: '#a855f7' }}>
                                  <IconVideo size={20} />
                                </span>
                              ) : (
                                <span style={{ color: '#38bdf8' }}>
                                  <IconFile size={20} />
                                </span>
                              )}
                              <div>
                                <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.85rem' }}>
                                  {fileName}
                                </div>
                                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                                  {item.public_id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td style={styles.td}>
                            <span style={styles.listBadge}>{item.format || item.resource_type}</span>
                          </td>
                          <td style={styles.td}>{formatBytes(item.bytes)}</td>
                          <td style={styles.td}>
                            {item.width && item.height ? `${item.width} × ${item.height}` : '—'}
                          </td>
                          <td style={styles.td}>
                            {item.created_at ? new Date(item.created_at).toLocaleDateString() : '—'}
                          </td>
                          <td style={{ ...styles.td, textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(item.secure_url)}
                                style={styles.tableBtn}
                              >
                                <IconCopy size={13} />
                                <span>Copy</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setRenameItem(item);
                                  setNewPublicId(item.public_id);
                                }}
                                style={styles.tableBtn}
                                title="Rename"
                              >
                                <IconEdit size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteItem(item)}
                                style={{ ...styles.tableBtn, color: '#ef4444' }}
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

      {/* MODAL: NEW FOLDER */}
      {isNewFolderOpen && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <IconFolder size={20} />
              <h3 style={styles.modalTitle}>Create New Folder</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '16px' }}>
              Current location: /{currentFolder || 'root'}
            </p>
            <form onSubmit={handleCreateFolder}>
              <input
                type="text"
                placeholder="Folder name (e.g. products, banners)"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                style={styles.modalInput}
                autoFocus
              />
              <div style={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setIsNewFolderOpen(false)}
                  style={styles.secondaryBtn}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingFolder || !newFolderName.trim()}
                  style={styles.primaryBtn}
                >
                  {creatingFolder ? 'Creating...' : 'Create Folder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DELETE FOLDER CONFIRMATION */}
      {folderToDelete && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#ef4444' }}>
              <IconTrash size={20} />
              <h3 style={{ ...styles.modalTitle, color: '#ef4444' }}>Delete Folder</h3>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '12px' }}>
              Are you sure you want to permanently delete folder <strong>&quot;{folderToDelete.name}&quot;</strong> and all assets inside it from Cloudinary?
            </p>
            <div style={styles.deletePathBox}>
              Folder Path: {folderToDelete.path}
            </div>
            <p style={{ color: '#ef4444', fontSize: '0.78rem', fontWeight: 700, marginBottom: '20px' }}>
              Warning: All images, videos, and raw files inside this folder will be permanently removed.
            </p>
            <div style={styles.modalActions}>
              <button
                type="button"
                onClick={() => setFolderToDelete(null)}
                style={styles.secondaryBtn}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteFolder}
                disabled={deletingFolder}
                style={styles.dangerBtn}
              >
                {deletingFolder ? 'Deleting Folder...' : 'Permanently Delete Folder'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: RENAME ITEM */}
      {renameItem && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <IconEdit size={20} />
              <h3 style={styles.modalTitle}>Rename Asset</h3>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '16px', wordBreak: 'break-all' }}>
              From: {renameItem.public_id}
            </p>
            <form onSubmit={handleRename}>
              <input
                type="text"
                placeholder="New Public ID (e.g. folder/new-name)"
                value={newPublicId}
                onChange={(e) => setNewPublicId(e.target.value)}
                style={styles.modalInput}
                autoFocus
              />
              <div style={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setRenameItem(null)}
                  style={styles.secondaryBtn}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={renaming || !newPublicId.trim()}
                  style={styles.primaryBtn}
                >
                  {renaming ? 'Renaming...' : 'Rename Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DELETE SINGLE CONFIRMATION */}
      {deleteItem && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#ef4444' }}>
              <IconTrash size={20} />
              <h3 style={{ ...styles.modalTitle, color: '#ef4444' }}>Delete Asset</h3>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '12px' }}>
              Are you sure you want to permanently delete this asset from Cloudinary?
            </p>
            <div style={styles.deletePathBox}>{deleteItem.public_id}</div>
            <div style={styles.modalActions}>
              <button
                type="button"
                onClick={() => setDeleteItem(null)}
                style={styles.secondaryBtn}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                style={styles.dangerBtn}
              >
                {deleting ? 'Deleting...' : 'Permanently Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: BULK DELETE CONFIRMATION */}
      {isBulkDeleteModalOpen && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#ef4444' }}>
              <IconTrash size={20} />
              <h3 style={{ ...styles.modalTitle, color: '#ef4444' }}>
                Delete {selectedIds.size} Selected Items
              </h3>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '12px' }}>
              Are you sure you want to permanently delete these {selectedIds.size} selected items from Cloudinary?
            </p>
            <div style={{ ...styles.deletePathBox, maxHeight: '140px', overflowY: 'auto' }}>
              {Array.from(selectedIds).map((id) => (
                <div key={id}>• {id}</div>
              ))}
            </div>
            <div style={styles.modalActions}>
              <button
                type="button"
                onClick={() => setIsBulkDeleteModalOpen(false)}
                style={styles.secondaryBtn}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => executeBatchDelete(Array.from(selectedIds))}
                disabled={bulkDeleting}
                style={styles.dangerBtn}
              >
                {bulkDeleting ? 'Deleting Items...' : `Delete ${selectedIds.size} Items`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: QUERY-BASED SEARCH DELETE CONFIRMATION */}
      {isQueryDeleteModalOpen && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#ef4444' }}>
              <IconTrash size={20} />
              <h3 style={{ ...styles.modalTitle, color: '#ef4444' }}>
                Delete All Matching Query
              </h3>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '8px' }}>
              Search Term: <strong style={{ color: '#ec4899' }}>&quot;{searchQuery}&quot;</strong>
            </p>
            <p style={{ color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '12px' }}>
              This action will permanently delete all <strong>{filteredResources.length}</strong> items matching this query from Cloudinary.
            </p>

            <div style={{ ...styles.deletePathBox, maxHeight: '160px', overflowY: 'auto' }}>
              {filteredResources.map((item) => (
                <div key={item.public_id}>• {item.public_id}</div>
              ))}
            </div>

            <div style={styles.modalActions}>
              <button
                type="button"
                onClick={() => setIsQueryDeleteModalOpen(false)}
                style={styles.secondaryBtn}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => executeBatchDelete(filteredResources.map((r) => r.public_id))}
                disabled={bulkDeleting}
                style={styles.dangerBtn}
              >
                {bulkDeleting ? 'Deleting Items...' : `Permanently Delete ${filteredResources.length} Items`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PREVIEW ITEM */}
      {previewItem && (
        <div style={styles.modalBackdrop} onClick={() => setPreviewItem(null)}>
          <div style={styles.previewCard} onClick={(e) => e.stopPropagation()}>
            <div style={styles.previewHeader}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
                  {getFileName(previewItem.public_id)}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  {previewItem.public_id} • {formatBytes(previewItem.bytes)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                style={styles.iconBtn}
              >
                <IconClose size={18} />
              </button>
            </div>

            <div style={styles.previewBody}>
              {previewItem.resource_type === 'image' ? (
                <img
                  src={previewItem.secure_url}
                  alt=""
                  style={styles.previewImg}
                />
              ) : previewItem.resource_type === 'video' ? (
                <video
                  src={previewItem.secure_url}
                  controls
                  autoPlay
                  style={styles.previewVideo}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <IconFile size={48} />
                  <p style={{ marginTop: '12px', color: '#cbd5e1' }}>Document / Raw File</p>
                  <a
                    href={previewItem.secure_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.primaryBtn}
                  >
                    Download File
                  </a>
                </div>
              )}
            </div>

            <div style={styles.previewFooter}>
              <button
                type="button"
                onClick={() => copyToClipboard(previewItem.secure_url)}
                style={styles.secondaryBtn}
              >
                <IconCopy size={14} />
                <span>Copy URL</span>
              </button>
              <a
                href={previewItem.secure_url}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.secondaryBtn}
              >
                Open External ↗
              </a>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div
          style={{
            ...styles.toast,
            background: toast.type === 'error' ? '#991b1b' : '#059669',
          }}
        >
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

// ==========================================
// INLINE STYLES (DARK MODERN DRIVE AESTHETIC)
// ==========================================
const styles = {
  container: {
    height: '100vh',
    maxHeight: '100vh',
    background: '#0b0f19',
    color: '#f8fafc',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  loadingScreen: {
    minHeight: '100vh',
    background: '#0b0f19',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
  },
  spinner: {
    width: '36px',
    height: '36px',
    borderWidth: '3px',
    borderStyle: 'solid',
    borderColor: '#1e293b',
    borderTopColor: '#ec4899',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  header: {
    background: '#111827',
    borderBottom: '1px solid #1e293b',
    padding: '12px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 0,
    zIndex: 10,
  },
  brandGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  backLink: {
    color: '#94a3b8',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: 600,
    padding: '6px 12px',
    background: '#1e293b',
    borderRadius: '8px',
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
  },
  title: {
    margin: 0,
    fontSize: '1.15rem',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    color: '#f8fafc',
  },
  subtitle: {
    margin: 0,
    fontSize: '0.75rem',
    color: '#94a3b8',
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  primaryBtn: {
    background: '#ec4899',
    color: '#fff',
    borderWidth: 0,
    borderStyle: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: 700,
    fontSize: '0.85rem',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 2px 8px rgba(236, 72, 153, 0.3)',
    textDecoration: 'none',
  },
  secondaryBtn: {
    background: '#1e293b',
    color: '#f8fafc',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#334155',
    padding: '8px 14px',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '0.85rem',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
  },
  dangerBtn: {
    background: '#dc2626',
    color: '#fff',
    borderWidth: 0,
    borderStyle: 'none',
    padding: '8px 14px',
    borderRadius: '8px',
    fontWeight: 700,
    fontSize: '0.85rem',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)',
  },
  iconBtn: {
    background: '#1e293b',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#334155',
    color: '#cbd5e1',
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  folderDeleteIconBtn: {
    background: 'transparent',
    borderWidth: 0,
    borderStyle: 'none',
    color: '#ef4444',
    cursor: 'pointer',
    padding: '4px 6px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.6,
  },
  deleteActiveFolderBtn: {
    background: 'rgba(239, 68, 68, 0.1)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    color: '#f87171',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '0.78rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    marginLeft: '8px',
  },
  mainLayout: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  sidebar: {
    width: '240px',
    background: '#0d1322',
    borderRight: '1px solid #1e293b',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    overflowY: 'auto',
    flexShrink: 0,
  },
  sidebarSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  sectionHeader: {
    fontSize: '0.7rem',
    fontWeight: 800,
    color: '#64748b',
    letterSpacing: '0.06em',
    marginBottom: '6px',
  },
  navItem: {
    background: 'transparent',
    borderWidth: 0,
    borderStyle: 'none',
    color: '#94a3b8',
    padding: '8px 10px',
    borderRadius: '8px',
    fontSize: '0.82rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    textAlign: 'left',
  },
  activeNavItem: {
    background: '#1e293b',
    color: '#f472b6',
    fontWeight: 700,
  },
  tinyBtn: {
    background: '#1e293b',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#334155',
    color: '#94a3b8',
    width: '22px',
    height: '22px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: 0,
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 24px',
    overflowY: 'auto',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '14px',
  },
  breadcrumbs: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '6px',
  },
  crumbBtn: {
    background: 'transparent',
    borderWidth: 0,
    borderStyle: 'none',
    color: '#94a3b8',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    padding: '2px 4px',
  },
  toolbarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#111827',
    border: '1px solid #1e293b',
    borderRadius: '8px',
    padding: '6px 12px',
    color: '#94a3b8',
  },
  searchInput: {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#f8fafc',
    fontSize: '0.82rem',
    width: '220px',
  },
  clearSearch: {
    background: 'transparent',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
  },
  viewToggleGroup: {
    display: 'flex',
    background: '#111827',
    border: '1px solid #1e293b',
    borderRadius: '8px',
    padding: '2px',
  },
  toggleBtn: {
    background: 'transparent',
    borderWidth: 0,
    borderStyle: 'none',
    color: '#64748b',
    padding: '5px 8px',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeToggle: {
    background: '#1e293b',
    color: '#f8fafc',
  },
  chipBtn: {
    background: '#111827',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#1e293b',
    color: '#94a3b8',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },
  activeChipBtn: {
    background: 'rgba(236, 72, 153, 0.15)',
    color: '#f472b6',
    borderColor: '#ec4899',
  },
  queryRibbon: {
    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(185, 28, 28, 0.08) 100%)',
    border: '1px solid rgba(239, 68, 68, 0.35)',
    borderRadius: '10px',
    padding: '10px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    gap: '12px',
  },
  bulkRibbon: {
    background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(190, 18, 60, 0.15) 100%)',
    border: '1px solid rgba(236, 72, 153, 0.4)',
    borderRadius: '10px',
    padding: '10px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    gap: '12px',
  },
  subHeading: {
    fontSize: '0.9rem',
    fontWeight: 700,
    color: '#cbd5e1',
    margin: 0,
  },
  selectAllBtn: {
    background: 'transparent',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#334155',
    color: '#94a3b8',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '0.75rem',
    cursor: 'pointer',
  },
  folderGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '12px',
    marginTop: '10px',
  },
  folderCard: {
    background: '#111827',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#1e293b',
    borderRadius: '10px',
    padding: '10px 14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  folderName: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#f8fafc',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  folderCardDeleteBtn: {
    background: 'rgba(239, 68, 68, 0.1)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    color: '#f87171',
    cursor: 'pointer',
    padding: '4px 6px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  assetGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '14px',
  },
  assetCard: {
    background: '#111827',
    borderRadius: '12px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#1e293b',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  selectedAssetCard: {
    borderColor: '#ec4899',
    background: '#181f33',
  },
  previewContainer: {
    position: 'relative',
    height: '140px',
    background: '#090d16',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  checkboxOverlay: {
    position: 'absolute',
    top: '8px',
    left: '8px',
    zIndex: 2,
  },
  cardCheckbox: {
    cursor: 'pointer',
    width: '16px',
    height: '16px',
  },
  gridImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  videoPlaceholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: '#a855f7',
  },
  rawPlaceholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: '#38bdf8',
  },
  formatBadge: {
    position: 'absolute',
    bottom: '6px',
    right: '6px',
    background: 'rgba(0, 0, 0, 0.7)',
    color: '#f8fafc',
    fontSize: '0.65rem',
    fontWeight: 700,
    padding: '2px 6px',
    borderRadius: '4px',
    textTransform: 'uppercase',
  },
  cardDetails: {
    padding: '10px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  assetTitle: {
    margin: 0,
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#f8fafc',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  assetMeta: {
    fontSize: '0.7rem',
    color: '#64748b',
    display: 'flex',
    gap: '6px',
  },
  cardActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '6px',
  },
  actionBtn: {
    flex: 1,
    background: '#1e293b',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#334155',
    color: '#cbd5e1',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '0.72rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
  },
  actionBtnIcon: {
    background: '#1e293b',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#334155',
    color: '#cbd5e1',
    padding: '4px 6px',
    borderRadius: '6px',
    fontSize: '0.72rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listViewContainer: {
    background: '#111827',
    borderRadius: '12px',
    border: '1px solid #1e293b',
    overflow: 'hidden',
  },
  listTable: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  th: {
    padding: '10px 14px',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#64748b',
    borderBottom: '1px solid #1e293b',
    textTransform: 'uppercase',
  },
  tr: {
    borderBottom: '1px solid #1e293b',
  },
  td: {
    padding: '10px 14px',
    fontSize: '0.8rem',
    color: '#cbd5e1',
  },
  listBadge: {
    background: '#1e293b',
    color: '#f472b6',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '0.68rem',
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  tableBtn: {
    background: '#1e293b',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#334155',
    color: '#cbd5e1',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '0.72rem',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  dragOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(11, 15, 25, 0.85)',
    backdropFilter: 'blur(4px)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dragBox: {
    border: '2px dashed #ec4899',
    borderRadius: '16px',
    padding: '40px 60px',
    textAlign: 'center',
    color: '#ec4899',
  },
  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(4px)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  modalCard: {
    background: '#111827',
    border: '1px solid #1e293b',
    borderRadius: '16px',
    padding: '24px',
    width: '100%',
    maxWidth: '440px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
  },
  modalTitle: {
    margin: 0,
    fontSize: '1.05rem',
    fontWeight: 800,
  },
  modalInput: {
    width: '100%',
    background: '#090d16',
    border: '1px solid #334155',
    borderRadius: '8px',
    padding: '10px 12px',
    color: '#fff',
    fontSize: '0.85rem',
    outline: 'none',
    marginBottom: '16px',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
  deletePathBox: {
    background: '#090d16',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #334155',
    fontFamily: 'monospace',
    fontSize: '0.8rem',
    color: '#f87171',
    wordBreak: 'break-all',
    marginBottom: '16px',
  },
  previewCard: {
    background: '#111827',
    border: '1px solid #1e293b',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '700px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  previewHeader: {
    padding: '14px 20px',
    borderBottom: '1px solid #1e293b',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewBody: {
    flex: 1,
    background: '#090d16',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    overflow: 'auto',
  },
  previewImg: {
    maxWidth: '100%',
    maxHeight: '60vh',
    objectFit: 'contain',
    borderRadius: '8px',
  },
  previewVideo: {
    maxWidth: '100%',
    maxHeight: '60vh',
    borderRadius: '8px',
  },
  previewFooter: {
    padding: '14px 20px',
    borderTop: '1px solid #1e293b',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
  toast: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    padding: '12px 20px',
    borderRadius: '10px',
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.88rem',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
    zIndex: 1100,
  },
  checkboxInput: {
    cursor: 'pointer',
    width: '15px',
    height: '15px',
  },
};
