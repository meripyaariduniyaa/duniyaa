import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateOrganicRetentionCoupon,
  disableOrganicRetentionCoupon,
  resolveCoupon,
} from '../lib/coupons.js';

// Mock in-memory Firestore DB for isolated unit testing
function createMockDb(initialDocs = {}) {
  const store = new Map();
  for (const [id, data] of Object.entries(initialDocs)) {
    store.set(id, { ...data, _id: id });
  }

  const mockDb = {
    collection(colName) {
      if (colName !== 'coupons') throw new Error(`Unsupported mock collection: ${colName}`);
      return {
        doc(customId) {
          const docId = customId || `doc_${Math.random().toString(36).slice(2, 9)}`;
          return {
            id: docId,
            async get() {
              const data = store.get(docId);
              return {
                exists: Boolean(data),
                id: docId,
                data: () => data,
              };
            },
            async set(data) {
              store.set(docId, { ...data, _id: docId });
            },
            async update(updates) {
              const current = store.get(docId) || {};
              store.set(docId, { ...current, ...updates });
            },
          };
        },
        where(field, op, value) {
          return {
            where(f2, op2, v2) {
              return {
                where(f3, op3, v3) {
                  return {
                    limit(n) {
                      return {
                        async get() {
                          const results = [];
                          for (const [id, d] of store.entries()) {
                            if (d[field] === value && d[f2] === v2 && d[f3] === v3) {
                              results.push({
                                id,
                                data: () => d,
                                ref: {
                                  update: async (u) => store.set(id, { ...d, ...u }),
                                },
                              });
                              if (results.length >= n) break;
                            }
                          }
                          return { empty: results.length === 0, docs: results, size: results.length };
                        },
                      };
                    },
                    async get() {
                      const results = [];
                      for (const [id, d] of store.entries()) {
                        if (d[field] === value && d[f2] === v2 && d[f3] === v3) {
                          results.push({
                            id,
                            data: () => d,
                            ref: { update: async (u) => store.set(id, { ...d, ...u }) },
                          });
                        }
                      }
                      return { empty: results.length === 0, docs: results, size: results.length };
                    },
                  };
                },
                limit(n) {
                  return {
                    async get() {
                      const results = [];
                      for (const [id, d] of store.entries()) {
                        if (d[field] === value && d[f2] === v2) {
                          results.push({
                            id,
                            data: () => d,
                            ref: { update: async (u) => store.set(id, { ...d, ...u }) },
                          });
                          if (results.length >= n) break;
                        }
                      }
                      return { empty: results.length === 0, docs: results, size: results.length };
                    },
                  };
                },
                async get() {
                  const results = [];
                  for (const [id, d] of store.entries()) {
                    if (d[field] === value && d[f2] === v2) {
                      results.push({
                        id,
                        data: () => d,
                        ref: { update: async (u) => store.set(id, { ...d, ...u }) },
                      });
                    }
                  }
                  return { empty: results.length === 0, docs: results, size: results.length };
                },
              };
            },
            limit(n) {
              return {
                async get() {
                  const results = [];
                  for (const [id, d] of store.entries()) {
                    if (d[field] === value) {
                      results.push({
                        id,
                        data: () => d,
                        ref: { update: async (u) => store.set(id, { ...d, ...u }) },
                      });
                      if (results.length >= n) break;
                    }
                  }
                  return { empty: results.length === 0, docs: results, size: results.length };
                },
              };
            },
            async get() {
              const results = [];
              for (const [id, d] of store.entries()) {
                if (d[field] === value) {
                  results.push({
                    id,
                    data: () => d,
                    ref: { update: async (u) => store.set(id, { ...d, ...u }) },
                  });
                }
              }
              return { empty: results.length === 0, docs: results, size: results.length };
            },
          };
        },
      };
    },
    batch() {
      const operations = [];
      return {
        update(docRef, updates) {
          operations.push(() => docRef.update(updates));
        },
        async commit() {
          for (const op of operations) await op();
        },
      };
    },
    _getStore: () => store,
  };

  return mockDb;
}

test('1. Automatic 10% organic retention coupon creation', async () => {
  const mockDb = createMockDb();
  const res = await generateOrganicRetentionCoupon(mockDb, { noteId: 'note_123', durationMinutes: 15 });

  assert.equal(res.discount_percent, 10);
  assert.equal(res.is_new, true);
  assert.ok(res.code.startsWith('SAVE10-'));
  assert.ok(res.remaining_seconds > 800);

  // Check stored in DB
  const resolved = await resolveCoupon(res.code, { db: mockDb });
  assert.equal(resolved.valid, true);
  assert.equal(resolved.percent, 10);
  assert.equal(resolved.type, 'organic_retention');
});

test('2. Reuses active unexpired retention coupon for same note', async () => {
  const mockDb = createMockDb();
  const first = await generateOrganicRetentionCoupon(mockDb, { noteId: 'note_456', durationMinutes: 15 });
  const second = await generateOrganicRetentionCoupon(mockDb, { noteId: 'note_456', durationMinutes: 15 });

  assert.equal(first.code, second.code);
  assert.equal(second.is_new, false);
});

test('3. Single-use enforcement: coupon is rejected after maximum usage (1 use)', async () => {
  const mockDb = createMockDb({
    c_used: {
      code: 'SAVE10-USED1',
      type: 'organic_retention',
      discount_percent: 10,
      active: true,
      max_uses: 1,
      usage_count: 1,
      expires_at: new Date(Date.now() + 600000),
    },
  });

  const res = await resolveCoupon('SAVE10-USED1', { db: mockDb });
  assert.equal(res.valid, false);
  assert.match(res.error, /already been redeemed/i);
});

test('4. Expiration enforcement: expired retention coupon is deactivated', async () => {
  const mockDb = createMockDb({
    c_expired: {
      code: 'SAVE10-EXP1',
      type: 'organic_retention',
      discount_percent: 10,
      active: true,
      max_uses: 1,
      usage_count: 0,
      expires_at: new Date(Date.now() - 60000), // expired 1 min ago
    },
  });

  const res = await resolveCoupon('SAVE10-EXP1', { db: mockDb });
  assert.equal(res.valid, false);
  assert.match(res.error, /expired/i);

  // Verify it got marked inactive
  const doc = mockDb._getStore().get('c_expired');
  assert.equal(doc.active, false);
});

test('5. Disabling coupon even when consumer did not use the code', async () => {
  const mockDb = createMockDb();
  const created = await generateOrganicRetentionCoupon(mockDb, { noteId: 'note_abandoned', durationMinutes: 15 });

  // Verify valid initially
  const before = await resolveCoupon(created.code, { db: mockDb });
  assert.equal(before.valid, true);

  // Consumer leaves / dismisses offer -> disable code
  await disableOrganicRetentionCoupon(mockDb, { code: created.code });

  // Code should now be disabled and rejected
  const after = await resolveCoupon(created.code, { db: mockDb });
  assert.equal(after.valid, false);
  assert.match(after.error, /inactive/i);
});

test('6. Disabling all organic retention coupons by note ID', async () => {
  const mockDb = createMockDb();
  const created = await generateOrganicRetentionCoupon(mockDb, { noteId: 'note_session_exit', durationMinutes: 15 });

  await disableOrganicRetentionCoupon(mockDb, { noteId: 'note_session_exit' });

  const resolved = await resolveCoupon(created.code, { db: mockDb });
  assert.equal(resolved.valid, false);
  assert.match(resolved.error, /inactive/i);
});
