'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

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
      setMessage(`✓ Post marked as ${newStatus}!`);
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
      setMessage(`✓ Post "${blog.title}" deleted.`);
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* HEADER BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>📝</span> Blog &amp; Content CMS
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
            Create, edit, and publish SEO-optimized articles, gift guides, and stories for LovelyCrafts.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Link
            href="/blog"
            target="_blank"
            style={{
              background: '#fff',
              color: '#334155',
              border: '1px solid #cbd5e1',
              padding: '10px 16px',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '0.88rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>🌐</span> View Public Blog ↗
          </Link>

          <Link
            href="/admin/blog/create"
            style={{
              background: 'linear-gradient(135deg, #e11d48, #f43f5e)',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.9rem',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(225,29,72,0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>➕</span> Write New Post
          </Link>
        </div>
      </div>

      {/* STATS STRIP */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div style={{ background: '#fff', padding: '18px 20px', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Articles</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>{blogs.length}</div>
        </div>

        <div style={{ background: '#fff', padding: '18px 20px', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase' }}>Published Live</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#15803d', marginTop: '4px' }}>{totalPublished}</div>
        </div>

        <div style={{ background: '#fff', padding: '18px 20px', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#d97706', textTransform: 'uppercase' }}>Drafts In Progress</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#b45309', marginTop: '4px' }}>{totalDrafts}</div>
        </div>
      </div>

      {/* ALERT MESSAGE */}
      {message && (
        <div style={{ padding: '12px 16px', borderRadius: '10px', fontSize: '0.88rem', background: message.startsWith('✓') ? '#dcfce7' : '#fee2e2', color: message.startsWith('✓') ? '#15803d' : '#b91c1c' }}>
          {message}
        </div>
      )}

      {/* FILTER & SEARCH BAR */}
      <div style={{ background: '#fff', padding: '16px 20px', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', gap: '14px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 280px', position: 'relative' }}>
          <input
            type="text"
            placeholder="🔍 Search articles by title, slug, tag, or excerpt..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: statusFilter === 'all' ? '1px solid #0f172a' : '1px solid #e2e8f0',
              background: statusFilter === 'all' ? '#0f172a' : '#f8fafc',
              color: statusFilter === 'all' ? '#fff' : '#64748b',
            }}
          >
            All ({blogs.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('published')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: statusFilter === 'published' ? '1px solid #16a34a' : '1px solid #e2e8f0',
              background: statusFilter === 'published' ? '#dcfce7' : '#f8fafc',
              color: statusFilter === 'published' ? '#15803d' : '#64748b',
            }}
          >
            Live ({totalPublished})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('draft')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: statusFilter === 'draft' ? '1px solid #d97706' : '1px solid #e2e8f0',
              background: statusFilter === 'draft' ? '#fef3c7' : '#f8fafc',
              color: statusFilter === 'draft' ? '#b45309' : '#64748b',
            }}
          >
            Drafts ({totalDrafts})
          </button>
        </div>
      </div>

      {/* BLOGS TABLE */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⏳</div>
          <p style={{ margin: 0, fontWeight: 600 }}>Loading blog articles...</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '900px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '14px 18px', fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', width: '70px' }}>Cover</th>
                  <th style={{ padding: '14px 18px', fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase' }}>Article Details</th>
                  <th style={{ padding: '14px 18px', fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase' }}>Tags</th>
                  <th style={{ padding: '14px 18px', fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase' }}>Blocks</th>
                  <th style={{ padding: '14px 18px', fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '14px 18px', fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase' }}>Date</th>
                  <th style={{ padding: '14px 18px', fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBlogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '48px 20px', textAlign: 'center', color: '#94a3b8' }}>
                      <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📝</div>
                      <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#334155', marginBottom: '6px' }}>No blog posts found</div>
                      <p style={{ margin: '0 0 16px', fontSize: '0.9rem' }}>Get started by writing your first article or guide.</p>
                      <Link
                        href="/admin/blog/create"
                        style={{
                          background: '#e11d48',
                          color: '#fff',
                          padding: '8px 18px',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          textDecoration: 'none',
                          display: 'inline-block',
                        }}
                      >
                        + Create First Article
                      </Link>
                    </td>
                  </tr>
                ) : (
                  filteredBlogs.map((b) => (
                    <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      
                      {/* COVER THUMBNAIL */}
                      <td style={{ padding: '14px 18px' }}>
                        {b.coverImage ? (
                          <img
                            src={b.coverImage}
                            alt={b.title}
                            style={{ width: '56px', height: '40px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                          />
                        ) : (
                          <div style={{ width: '56px', height: '40px', background: '#f1f5f9', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: '#94a3b8' }}>
                            🖼️
                          </div>
                        )}
                      </td>

                      {/* ARTICLE DETAILS */}
                      <td style={{ padding: '14px 18px', maxWidth: '300px' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', marginBottom: '2px', lineHeight: 1.3 }}>
                          {b.title}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', fontFamily: 'monospace' }}>
                          /blog/{b.slug}
                        </div>
                        {b.excerpt && (
                          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {b.excerpt}
                          </div>
                        )}
                      </td>

                      {/* TAGS */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', maxWidth: '160px' }}>
                          {(b.tags || []).length > 0 ? (
                            b.tags.map((tag) => (
                              <span
                                key={tag}
                                style={{
                                  background: '#f1f5f9',
                                  color: '#475569',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  fontSize: '0.7rem',
                                  fontWeight: 600,
                                }}
                              >
                                #{tag}
                              </span>
                            ))
                          ) : (
                            <span style={{ color: '#cbd5e1', fontSize: '0.75rem' }}>—</span>
                          )}
                        </div>
                      </td>

                      {/* BLOCKS COUNT */}
                      <td style={{ padding: '14px 18px', fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                        {(b.blocks || []).length} blocks
                      </td>

                      {/* STATUS TOGGLE */}
                      <td style={{ padding: '14px 18px' }}>
                        <button
                          type="button"
                          disabled={togglingId === b.id}
                          onClick={() => handleToggleStatus(b)}
                          style={{
                            border: 'none',
                            padding: '4px 10px',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            background: b.status === 'published' ? '#dcfce7' : '#fef3c7',
                            color: b.status === 'published' ? '#15803d' : '#b45309',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <span>{b.status === 'published' ? '● Published' : '○ Draft'}</span>
                        </button>
                      </td>

                      {/* DATE */}
                      <td style={{ padding: '14px 18px', fontSize: '0.8rem', color: '#64748b' }}>
                        <div>{b.publishedAt ? new Date(b.publishedAt).toLocaleDateString() : 'Unpublished'}</div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                          Updated: {b.updatedAt ? new Date(b.updatedAt).toLocaleDateString() : '—'}
                        </div>
                      </td>

                      {/* ACTIONS */}
                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', alignItems: 'center' }}>
                          {b.status === 'published' && (
                            <Link
                              href={`/blog/${b.slug}`}
                              target="_blank"
                              title="View live post"
                              style={{
                                background: '#f8fafc',
                                color: '#0284c7',
                                border: '1px solid #e0f2fe',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                textDecoration: 'none',
                              }}
                            >
                              👁️ View
                            </Link>
                          )}

                          <Link
                            href={`/admin/blog/edit?id=${b.id}`}
                            title="Edit article"
                            style={{
                              background: '#f1f5f9',
                              color: '#334155',
                              border: '1px solid #cbd5e1',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              textDecoration: 'none',
                            }}
                          >
                            ✏️ Edit
                          </Link>

                          <button
                            type="button"
                            disabled={deletingId === b.id}
                            onClick={() => handleDelete(b)}
                            title="Delete article permanently"
                            style={{
                              background: '#fff1f2',
                              color: '#be123c',
                              border: '1px solid #fecdd3',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            {deletingId === b.id ? '...' : '🗑️'}
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
