'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import BlogBlocks from '@/components/BlogBlocks';

function slugify(text) {
  return (text || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export default function AdminBlogEditorPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const isEditMode = params.action === 'edit' || !!searchParams.get('id');
  const postId = searchParams.get('id');

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [manualSlug, setManualSlug] = useState(false);
  const [coverImage, setCoverImage] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [author, setAuthor] = useState('LovelyCrafts Editorial');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(['gifts', 'guides']);
  const [status, setStatus] = useState('draft');
  const [blocks, setBlocks] = useState([
    {
      id: 'block-1',
      type: 'paragraph',
      content: 'Write your introductory paragraph here...',
    },
  ]);

  // Cloudinary upload state
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingBlockIndex, setUploadingBlockIndex] = useState(null);
  const coverFileInputRef = useRef(null);
  const blockFileInputRef = useRef(null);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'vkcgnlm1';
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'apology_images';

  // Load existing post if editing
  useEffect(() => {
    if (isEditMode && postId && user) {
      user.getIdToken().then((token) => {
        fetch(`/api/admin/blog/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.post) {
              const p = data.post;
              setTitle(p.title || '');
              setSlug(p.slug || '');
              setManualSlug(true);
              setCoverImage(p.coverImage || '');
              setExcerpt(p.excerpt || '');
              setAuthor(p.author || 'LovelyCrafts Editorial');
              setTags(Array.isArray(p.tags) ? p.tags : []);
              setStatus(p.status || 'draft');
              if (Array.isArray(p.blocks) && p.blocks.length > 0) {
                setBlocks(p.blocks.map((b, i) => ({ ...b, id: b.id || `block-${i}-${Date.now()}` })));
              }
            } else {
              setMessage('Error: Blog post could not be loaded');
            }
          })
          .catch((err) => setMessage(`Error: ${err.message}`))
          .finally(() => setLoading(false));
      });
    }
  }, [isEditMode, postId, user]);

  // Auto-slugify when title changes (unless manually edited)
  const handleTitleChange = (val) => {
    setTitle(val);
    if (!manualSlug) {
      setSlug(slugify(val));
    }
  };

  // Add Tag
  const handleAddTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const clean = tagInput.trim().toLowerCase().replace(/^#/, '');
      if (clean && !tags.includes(clean)) {
        setTags([...tags, clean]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tToRemove) => {
    setTags(tags.filter((t) => t !== tToRemove));
  };

  // Direct Cloudinary Upload Helper
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'admin-uploads');

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (!data.secure_url) {
      throw new Error(data?.error?.message || 'Upload failed');
    }
    return data.secure_url;
  };

  const handleCoverUpload = async (file) => {
    if (!file) return;
    try {
      setUploadingCover(true);
      setMessage('');
      const url = await uploadImageToCloudinary(file);
      setCoverImage(url);
      setMessage('✓ Cover image uploaded!');
    } catch (err) {
      setMessage(`Cover upload error: ${err.message}`);
    } finally {
      setUploadingCover(false);
    }
  };

  const handleBlockImageUpload = async (file, blockIndex) => {
    if (!file) return;
    try {
      setUploadingBlockIndex(blockIndex);
      setMessage('');
      const url = await uploadImageToCloudinary(file);
      updateBlock(blockIndex, { url });
      setMessage('✓ Image uploaded to block!');
    } catch (err) {
      setMessage(`Image upload error: ${err.message}`);
    } finally {
      setUploadingBlockIndex(null);
    }
  };

  // Block Manipulation Functions
  const addBlock = (type) => {
    const newId = `block-${Date.now()}`;
    let newBlock = { id: newId, type };

    switch (type) {
      case 'heading':
        newBlock.content = 'New Section Heading';
        newBlock.level = 2;
        break;
      case 'paragraph':
        newBlock.content = '';
        break;
      case 'image':
        newBlock.url = '';
        newBlock.caption = '';
        break;
      case 'quote':
        newBlock.content = 'A meaningful quote or insight...';
        newBlock.attribution = 'Author Name';
        break;
      case 'list':
        newBlock.items = ['First item', 'Second item'];
        newBlock.ordered = false;
        break;
      case 'callout':
        newBlock.title = 'Pro Tip';
        newBlock.content = 'Helpful tip for readers';
        newBlock.calloutType = 'tip';
        break;
      case 'cta':
        newBlock.title = 'Send an Interactive Gift';
        newBlock.content = 'Surprise your favourite person in 2 minutes with custom photos and music.';
        newBlock.link = '/templates';
        newBlock.buttonText = 'Craft a Surprise Now →';
        break;
      case 'code':
        newBlock.content = '';
        newBlock.language = 'javascript';
        break;
      case 'divider':
        break;
      default:
        newBlock.content = '';
    }

    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (index, fields) => {
    setBlocks((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...fields };
      return next;
    });
  };

  const removeBlock = (index) => {
    setBlocks((prev) => prev.filter((_, i) => i !== index));
  };

  const moveBlock = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;
    setBlocks((prev) => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[target];
      next[target] = temp;
      return next;
    });
  };

  const duplicateBlock = (index) => {
    setBlocks((prev) => {
      const next = [...prev];
      const dup = { ...next[index], id: `block-${Date.now()}` };
      next.splice(index + 1, 0, dup);
      return next;
    });
  };

  // Submit Post
  const handleSave = async (targetStatus = status) => {
    if (!title.trim()) {
      setMessage('Error: Post title is required.');
      return;
    }

    try {
      setSaving(true);
      setMessage('');
      const token = await user.getIdToken();

      const payload = {
        title: title.trim(),
        slug: slug.trim() || slugify(title),
        coverImage: coverImage.trim(),
        excerpt: excerpt.trim(),
        author: author.trim() || 'LovelyCrafts Editorial',
        tags,
        status: targetStatus,
        blocks,
      };

      const url = isEditMode && postId ? `/api/admin/blog/${postId}` : '/api/admin/blog';
      const method = isEditMode && postId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save blog post');

      setMessage(`✓ Blog post ${targetStatus === 'published' ? 'published' : 'saved as draft'} successfully!`);
      setStatus(targetStatus);

      if (!isEditMode && data.id) {
        // Redirect to edit mode for newly created post
        setTimeout(() => {
          router.push(`/admin/blog/edit?id=${data.id}`);
        }, 1000);
      }
    } catch (err) {
      console.error('Error saving post:', err);
      setMessage(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: '#64748b' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>⏳</div>
        <p style={{ fontWeight: 600 }}>Loading article editor...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* TOP ACTIONS BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', background: '#fff', padding: '16px 20px', borderRadius: '16px', border: '1px solid #e2e8f0', position: 'sticky', top: '70px', zIndex: 40, boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            href="/admin/blog"
            style={{ color: '#64748b', textDecoration: 'none', fontWeight: 700, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            ← Back to Posts
          </Link>
          <span style={{ color: '#cbd5e1' }}>|</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: status === 'published' ? '#16a34a' : '#d97706', background: status === 'published' ? '#dcfce7' : '#fef3c7', padding: '3px 8px', borderRadius: '6px' }}>
            {status === 'published' ? '● Live' : '○ Draft'}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Toggle Live Preview */}
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            style={{
              background: previewMode ? '#0f172a' : '#f8fafc',
              color: previewMode ? '#fff' : '#334155',
              border: '1px solid #cbd5e1',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>{previewMode ? '✏️ Edit Mode' : '👁️ Live Preview'}</span>
          </button>

          {/* Save as Draft */}
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave('draft')}
            style={{
              background: '#f1f5f9',
              color: '#334155',
              border: '1px solid #cbd5e1',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: saving ? 'not-allowed' : 'pointer',
            }}
          >
            {saving ? 'Saving...' : 'Save Draft'}
          </button>

          {/* Publish Button */}
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave('published')}
            style={{
              background: 'linear-gradient(135deg, #e11d48, #f43f5e)',
              color: '#fff',
              border: 'none',
              padding: '8px 20px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: saving ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(225,29,72,0.25)',
            }}
          >
            {saving ? 'Publishing...' : 'Publish Post 🚀'}
          </button>
        </div>
      </div>

      {/* FEEDBACK MESSAGE */}
      {message && (
        <div style={{ padding: '12px 16px', borderRadius: '10px', fontSize: '0.88rem', background: message.startsWith('✓') ? '#dcfce7' : '#fee2e2', color: message.startsWith('✓') ? '#15803d' : '#b91c1c' }}>
          {message}
        </div>
      )}

      {/* LIVE PREVIEW VIEW */}
      {previewMode ? (
        <div style={{ background: '#fff', padding: '40px 32px', borderRadius: '20px', border: '1px solid #e2e8f0', maxWidth: '820px', margin: '0 auto', width: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
            {tags.map((t) => (
              <span key={t} style={{ background: '#ffe4e6', color: '#e11d48', padding: '4px 10px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 700 }}>
                #{t}
              </span>
            ))}
          </div>

          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', margin: '0 0 16px', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            {title || 'Untitled Article Preview'}
          </h1>

          {excerpt && (
            <p style={{ fontSize: '1.2rem', color: '#64748b', margin: '0 0 24px', lineHeight: 1.6 }}>
              {excerpt}
            </p>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 0', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', marginBottom: '32px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, #f43f5e, #fb7185)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
              ❤️
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>{author}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • 4 min read
              </div>
            </div>
          </div>

          {coverImage && (
            <div style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '32px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
              <img src={coverImage} alt={title} style={{ width: '100%', maxHeight: '450px', objectFit: 'cover', display: 'block' }} />
            </div>
          )}

          <BlogBlocks blocks={blocks} />
        </div>
      ) : (
        /* EDITING MODE FORM */
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>

          {/* MAIN COLUMN: TITLE + BLOCKS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* TITLE & SLUG CARD */}
            <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Article Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 10 Most Creative Midnight Birthday Surprises for Long Distance"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  outline: 'none',
                }}
              />

              <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#64748b' }}>
                <span style={{ fontWeight: 600 }}>Slug: /blog/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlug(slugify(e.target.value));
                    setManualSlug(true);
                  }}
                  placeholder="post-url-slug"
                  style={{
                    flex: 1,
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.82rem',
                    fontFamily: 'monospace',
                  }}
                />
              </div>
            </div>

            {/* CONTENT BLOCKS SECTION */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🧱</span> Content Blocks ({blocks.length})
                </h3>
              </div>

              {/* BLOCK LIST */}
              {blocks.map((block, index) => (
                <div
                  key={block.id || index}
                  style={{
                    background: '#fff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    padding: '20px',
                    position: 'relative',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                  }}
                >
                  {/* BLOCK TOOLBAR */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>
                        #{index + 1} {block.type}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        type="button"
                        onClick={() => moveBlock(index, -1)}
                        disabled={index === 0}
                        title="Move block up"
                        style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '4px 8px', borderRadius: '6px', cursor: index === 0 ? 'not-allowed' : 'pointer', fontSize: '0.8rem', opacity: index === 0 ? 0.4 : 1 }}
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => moveBlock(index, 1)}
                        disabled={index === blocks.length - 1}
                        title="Move block down"
                        style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '4px 8px', borderRadius: '6px', cursor: index === blocks.length - 1 ? 'not-allowed' : 'pointer', fontSize: '0.8rem', opacity: index === blocks.length - 1 ? 0.4 : 1 }}
                      >
                        ▼
                      </button>
                      <button
                        type="button"
                        onClick={() => duplicateBlock(index)}
                        title="Duplicate block"
                        style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
                      >
                        📋
                      </button>
                      <button
                        type="button"
                        onClick={() => removeBlock(index)}
                        title="Remove block"
                        style={{ background: '#fff1f2', border: '1px solid #fecdd3', color: '#be123c', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* BLOCK SPECIFIC INPUTS */}
                  {block.type === 'heading' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <select
                          value={block.level || 2}
                          onChange={(e) => updateBlock(index, { level: Number(e.target.value) })}
                          style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 700 }}
                        >
                          <option value={2}>H2 (Main Heading)</option>
                          <option value={3}>H3 (Subheading)</option>
                          <option value={4}>H4 (Minor Heading)</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Heading text..."
                          value={block.content || ''}
                          onChange={(e) => updateBlock(index, { content: e.target.value })}
                          style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 700, fontSize: '1rem' }}
                        />
                      </div>
                    </div>
                  )}

                  {block.type === 'paragraph' && (
                    <div>
                      <textarea
                        rows={4}
                        placeholder="Write paragraph content here. Double line break creates a new paragraph..."
                        value={block.content || ''}
                        onChange={(e) => updateBlock(index, { content: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', lineHeight: 1.6, resize: 'vertical' }}
                      />
                    </div>
                  )}

                  {block.type === 'image' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input
                          type="text"
                          placeholder="Image URL or upload below..."
                          value={block.url || ''}
                          onChange={(e) => updateBlock(index, { url: e.target.value })}
                          style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                        />
                        <label style={{ background: '#fdf2f8', border: '1px dashed #ec4899', color: '#be185d', padding: '8px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>
                          <span>{uploadingBlockIndex === index ? '⏳ Uploading...' : '📸 Upload Photo'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => handleBlockImageUpload(e.target.files[0], index)}
                          />
                        </label>
                      </div>
                      <input
                        type="text"
                        placeholder="Image Caption (optional)..."
                        value={block.caption || ''}
                        onChange={(e) => updateBlock(index, { caption: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontStyle: 'italic' }}
                      />
                      {block.url && (
                        <div style={{ borderRadius: '8px', overflow: 'hidden', maxHeight: '200px', border: '1px solid #e2e8f0' }}>
                          <img src={block.url} alt="Block preview" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                        </div>
                      )}
                    </div>
                  )}

                  {block.type === 'quote' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <textarea
                        rows={2}
                        placeholder="Quote text..."
                        value={block.content || ''}
                        onChange={(e) => updateBlock(index, { content: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontStyle: 'italic', fontSize: '0.95rem' }}
                      />
                      <input
                        type="text"
                        placeholder="Attribution (e.g. Maya Angelou, or LovelyCrafts Customer)..."
                        value={block.attribution || ''}
                        onChange={(e) => updateBlock(index, { attribution: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                      />
                    </div>
                  )}

                  {block.type === 'list' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={!!block.ordered}
                            onChange={(e) => updateBlock(index, { ordered: e.target.checked })}
                          />
                          <span>Numbered List (1, 2, 3)</span>
                        </label>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {(block.items || []).map((item, itemIdx) => (
                          <div key={itemIdx} style={{ display: 'flex', gap: '8px' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', padding: '8px 0' }}>
                              {block.ordered ? `${itemIdx + 1}.` : '•'}
                            </span>
                            <input
                              type="text"
                              value={typeof item === 'string' ? item : item?.text || ''}
                              onChange={(e) => {
                                const newItems = [...(block.items || [])];
                                newItems[itemIdx] = e.target.value;
                                updateBlock(index, { items: newItems });
                              }}
                              placeholder={`List item ${itemIdx + 1}...`}
                              style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newItems = (block.items || []).filter((_, i) => i !== itemIdx);
                                updateBlock(index, { items: newItems });
                              }}
                              style={{ background: '#f1f5f9', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', color: '#64748b' }}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const newItems = [...(block.items || []), ''];
                            updateBlock(index, { items: newItems });
                          }}
                          style={{ alignSelf: 'flex-start', background: '#f8fafc', border: '1px dashed #cbd5e1', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', color: '#475569', marginTop: '4px' }}
                        >
                          + Add Item
                        </button>
                      </div>
                    </div>
                  )}

                  {block.type === 'callout' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '10px' }}>
                        <select
                          value={block.calloutType || 'tip'}
                          onChange={(e) => updateBlock(index, { calloutType: e.target.value })}
                          style={{ padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 600 }}
                        >
                          <option value="tip">💡 Tip</option>
                          <option value="heart">💖 Heart</option>
                          <option value="info">ℹ️ Info</option>
                          <option value="warning">⚠️ Warning</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Callout Title (e.g. Pro Tip: Add photos first)..."
                          value={block.title || ''}
                          onChange={(e) => updateBlock(index, { title: e.target.value })}
                          style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 700 }}
                        />
                      </div>
                      <textarea
                        rows={2}
                        placeholder="Callout text details..."
                        value={block.content || ''}
                        onChange={(e) => updateBlock(index, { content: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                      />
                    </div>
                  )}

                  {block.type === 'cta' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: '#fff1f2', padding: '14px', borderRadius: '10px' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#be123c' }}>🎁 Custom Surprise Banner CTA</div>
                      <input
                        type="text"
                        placeholder="Banner Title (e.g. Ready to craft your own birthday surprise?)..."
                        value={block.title || ''}
                        onChange={(e) => updateBlock(index, { title: e.target.value })}
                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 700 }}
                      />
                      <input
                        type="text"
                        placeholder="Button text (e.g. Craft Birthday Surprise →)..."
                        value={block.buttonText || ''}
                        onChange={(e) => updateBlock(index, { buttonText: e.target.value })}
                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                      />
                      <input
                        type="text"
                        placeholder="Target Link (e.g. /templates/birthday)..."
                        value={block.link || ''}
                        onChange={(e) => updateBlock(index, { link: e.target.value })}
                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'monospace', fontSize: '0.82rem' }}
                      />
                    </div>
                  )}

                  {block.type === 'code' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <input
                        type="text"
                        placeholder="Language (e.g. javascript, html, css)..."
                        value={block.language || ''}
                        onChange={(e) => updateBlock(index, { language: e.target.value })}
                        style={{ width: '180px', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                      />
                      <textarea
                        rows={4}
                        placeholder="// write code here..."
                        value={block.content || ''}
                        onChange={(e) => updateBlock(index, { content: e.target.value })}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'monospace', fontSize: '0.85rem', background: '#0f172a', color: '#f8fafc' }}
                      />
                    </div>
                  )}

                  {block.type === 'divider' && (
                    <div style={{ textAlign: 'center', color: '#fda4af', padding: '10px 0', fontSize: '1.2rem' }}>
                      ─── ❤️ ─── (Divider Line)
                    </div>
                  )}

                </div>
              ))}

              {/* ADD BLOCK BUTTONS BAR */}
              <div style={{ background: '#fff', padding: '16px', borderRadius: '16px', border: '2px dashed #cbd5e1', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>➕ Add Content Block:</span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <button
                    type="button"
                    onClick={() => addBlock('paragraph')}
                    style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '8px 14px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    📝 Paragraph
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock('heading')}
                    style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '8px 14px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    🔤 Heading
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock('image')}
                    style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '8px 14px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    🖼️ Image
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock('quote')}
                    style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '8px 14px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    💬 Quote
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock('list')}
                    style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '8px 14px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    📋 List
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock('callout')}
                    style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '8px 14px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    💡 Callout
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock('cta')}
                    style={{ background: '#fff1f2', border: '1px solid #fecdd3', color: '#be123c', padding: '8px 14px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    🎁 Gift CTA
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock('divider')}
                    style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '8px 14px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    〰️ Divider
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* SIDEBAR COLUMN: COVER IMAGE, EXCERPT, SEO, TAGS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* COVER IMAGE CARD */}
            <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
                Featured Cover Image
              </label>

              {coverImage ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                    <img src={coverImage} alt="Cover preview" style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={() => setCoverImage('')}
                      style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer', fontSize: '0.75rem' }}
                    >
                      ✕
                    </button>
                  </div>
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="Image URL"
                    style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.75rem' }}
                  />
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input
                    type="file"
                    ref={coverFileInputRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleCoverUpload(e.target.files[0])}
                  />
                  <button
                    type="button"
                    disabled={uploadingCover}
                    onClick={() => coverFileInputRef.current?.click()}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: 'linear-gradient(135deg, #fff1f2, #ffe4e6)',
                      border: '1.5px dashed #f43f5e',
                      borderRadius: '10px',
                      color: '#be185d',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: uploadingCover ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {uploadingCover ? '⏳ Uploading...' : '📸 Upload Cover Photo'}
                  </button>
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="Or paste image URL here..."
                    style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                  />
                </div>
              )}
            </div>

            {/* EXCERPT & SEO CARD */}
            <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Excerpt / Meta Description
              </label>
              <textarea
                rows={3}
                placeholder="1-2 sentences summarizing this post for search engines and social cards..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', lineHeight: 1.5 }}
              />
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px', textAlign: 'right' }}>
                {excerpt.length} / 160 characters
              </div>
            </div>

            {/* TAGS CARD */}
            <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Categories &amp; Tags
              </label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                {tags.map((t) => (
                  <span
                    key={t}
                    style={{
                      background: '#f1f5f9',
                      color: '#334155',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => removeTag(t)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0, fontSize: '0.75rem' }}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Type tag and press Enter..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
            </div>

            {/* AUTHOR CARD */}
            <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Author Byline
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="LovelyCrafts Editorial"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
              />
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
