import test from 'node:test';
import assert from 'node:assert/strict';

test('Birthday & Proposal templates correctly normalize photos from any source', () => {
  const normalizePhotos = (note) => {
    const rawPhotos = note?.image_urls || note?.images || note?.photos || note?.custom_details?.images || note?.custom_details?.photos || [];
    return (Array.isArray(rawPhotos) ? rawPhotos : []).map((p) => (typeof p === 'string' ? p : p?.url)).filter(Boolean);
  };

  // Case 1: Standard note.image_urls
  const note1 = { image_urls: ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'] };
  assert.deepEqual(normalizePhotos(note1), ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg']);

  // Case 2: note.images
  const note2 = { images: ['https://example.com/photo3.jpg'] };
  assert.deepEqual(normalizePhotos(note2), ['https://example.com/photo3.jpg']);

  // Case 3: note.custom_details.images
  const note3 = { custom_details: { images: ['https://example.com/photo4.jpg'] } };
  assert.deepEqual(normalizePhotos(note3), ['https://example.com/photo4.jpg']);

  // Case 4: Objects with url property
  const note4 = { image_urls: [{ url: 'https://example.com/photo5.jpg' }] };
  assert.deepEqual(normalizePhotos(note4), ['https://example.com/photo5.jpg']);

  // Case 5: Empty/null/undefined note
  assert.deepEqual(normalizePhotos(null), []);
  assert.deepEqual(normalizePhotos({}), []);
  assert.deepEqual(normalizePhotos({ image_urls: [] }), []);
});
