'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import {
  BlogIcon,
  PlusIcon,
  ExternalLinkIcon,
  SearchIcon,
  EditIcon,
  TrashIcon,
  CheckIcon
} from '@/components/admin/AdminIcons';

export default function AdminBlogListPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [message, setMessage] = useState('');

  const loadBlogs = async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/blog', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.blogs) {
        setBlogs(data.blogs);
      }
    } catch (err) {
      console.error('Failed to load blogs:', err);
      setMessage(`Error loading blogs: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, [user]);

  const handleToggleStatus = async (blog) => {
    try {
      setTogglingId(blog.id);
      const newStatus = blog.status === 'published' ? 'draft' : 'published';
      const token = await user.getIdToken();
      const res = await fetch(`/api/admin/blog/${blog.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      setMessage(`Post marked as ${newStatus}!`);
      loadBlogs();
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (blog) => {
    if (!confirm(`Are you sure you want to PERMANENTLY delete "${blog.title}"?\n\nThis action cannot be undone.`)) {
      return;
    }
    try {
      setDeletingId(blog.id);
      const token = await user.getIdToken();
      const res = await fetch(`/api/admin/blog/${blog.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete post');
      setMessage(`Post "${blog.title}" deleted.`);
      loadBlogs();
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredBlogs = blogs.filter((b) => {
    const matchesSearch =
      (b.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (b.slug || '').toLowerCase().includes(search.toLowerCase()) ||
      (b.tags || []).some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
      (b.excerpt || '').toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && b.status === 'published') ||
      (statusFilter === 'draft' && b.status !== 'published');

    return matchesSearch && matchesStatus;
  });

  const totalPublished = blogs.filter((b) => b.status === 'published').length;
  const totalDrafts = blogs.filter((b) => b.status !== 'published').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* HEADER BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
            Blog &amp; Editorial Engine
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
            Author, edit, and publish SEO-optimized articles, gift guides, and customer stories.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Link
            href="/blog"
            target="_blank"
            style={{
              background: '#ffffff',
              color: '#0f172a',
              border: '1px solid #e2e8f0',
              padding: '10px 16px',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '0.85rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>View Public Blog</span>
            <ExternalLinkIcon size={14} />
          </Link>

          <Link
            href="/admin/blog/create"
            style={{
              background: '#0f172a',
              color: '#fff',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.85rem',
              textDecoration: 'none',
              boxShadow: '0 2px 6px rgba(15, 23, 42, 0.15)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <PlusIcon size={16} />
            <span>Write New Post</span>
          </Link>
        </div>
      </div>

      {message && (
        <div style={{ padding: '12px 16px', borderRadius: '10px', fontSize: '0.85rem', background: message.startsWith('Error') ? '#fee2e2' : '#f0fdf4', color: message.startsWith('Error') ? '#991b1b' : '#15803d', border: message.startsWith('Error') ? '1px solid #fecaca' : '1px solid #bbf7d0' }}>
          {message}
        </div>
      )}

      {/* STAT STRIP & SEARCH */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* STATUS PILLS */}
        <div style={{ display: 'flex', gap: '4px', background: '#ffffff', padding: '4px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            style={{
              background: statusFilter === 'all' ? '#0f172a' : 'transparent',
              color: statusFilter === 'all' ? '#fff' : '#64748b',
              border: 'none',
              padding: '7px 16px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            All Articles ({blogs.length})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('published')}
            style={{
              background: statusFilter === 'published' ? '#0f172a' : 'transparent',
              color: statusFilter === 'published' ? '#fff' : '#64748b',
              border: 'none',
              padding: '7px 16px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            Published ({totalPublished})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('draft')}
            style={{
              background: statusFilter === 'draft' ? '#0f172a' : 'transparent',
              color: statusFilter === 'draft' ? '#fff' : '#64748b',
              border: 'none',
              padding: '7px 16px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            Drafts ({totalDrafts})
          </button>
        </div>

        {/* SEARCH INPUT */}
        <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}>
            <SearchIcon size={16} />
          </span>
          <input
            type="text"
            placeholder="Search posts by title, tag, or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.82rem', outline: 'none', background: '#fff' }}
          />
        </div>

      </div>

      {/* BLOG POSTS LIST TABLE */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '3px solid #e2e8f0', borderTopColor: '#0284c7', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Loading blog articles...</p>
        </div>
      ) : (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Article Title &amp; Slug</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category / Tags</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBlogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '60px 20px', textAlign: 'center', color: '#94a3b8' }}>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>No blog articles found</div>
                      <div style={{ fontSize: '0.8rem' }}>Write a new article to engage your audience.</div>
                    </td>
                  </tr>
                ) : (
                  filteredBlogs.map((b) => {
                    const isPublished = b.status === 'published';
                    return (
                      <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.1s ease' }}>
                        
                        {/* TITLE & SLUG */}
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>
                            {b.title}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#0284c7', fontFamily: 'monospace', marginTop: '2px' }}>
                            /blog/{b.slug}
                          </div>
                        </td>

                        {/* TAGS */}
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            {(b.tags || []).slice(0, 3).map((tag) => (
                              <span key={tag} style={{ background: '#f1f5f9', color: '#475569', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem' }}>
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* DATE */}
                        <td style={{ padding: '16px 20px', fontSize: '0.82rem', color: '#64748b' }}>
                          {b.published_at ? new Date(b.published_at).toLocaleDateString([], { dateStyle: 'medium' }) : b.created_at ? new Date(b.created_at).toLocaleDateString([], { dateStyle: 'medium' }) : 'Recent'}
                        </td>

                        {/* STATUS */}
                        <td style={{ padding: '16px 20px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '3px 10px',
                              borderRadius: '999px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              background: isPublished ? '#dcfce7' : '#fef3c7',
                              color: isPublished ? '#15803d' : '#b45309',
                              border: `1px solid ${isPublished ? '#bbf7d0' : '#fde68a'}`,
                            }}
                          >
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isPublished ? '#22c55e' : '#f59e0b' }} />
                            <span>{isPublished ? 'Published' : 'Draft'}</span>
                          </span>
                        </td>

                        {/* ACTIONS */}
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(b)}
                              disabled={togglingId === b.id}
                              style={{
                                background: '#ffffff',
                                border: '1px solid #e2e8f0',
                                color: isPublished ? '#ea580c' : '#15803d',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              {togglingId === b.id ? '...' : isPublished ? 'Unpublish' : 'Publish'}
                            </button>

                            <Link
                              href={`/admin/blog/edit/${b.id}`}
                              style={{
                                background: '#ffffff',
                                border: '1px solid #e2e8f0',
                                color: '#0f172a',
                                padding: '6px 8px',
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                textDecoration: 'none'
                              }}
                              title="Edit Article"
                            >
                              <EditIcon size={14} />
                            </Link>

                            <button
                              type="button"
                              onClick={() => handleDelete(b)}
                              disabled={deletingId === b.id}
                              style={{
                                background: '#ffffff',
                                border: '1px solid #fecaca',
                                color: '#b91c1c',
                                padding: '6px 8px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                              title="Delete Article"
                            >
                              <TrashIcon size={14} />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
