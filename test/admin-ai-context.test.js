import test from 'node:test';
import assert from 'node:assert/strict';
import { getAdminAiPageProfile, PAGE_PROFILES } from '../lib/admin-ai-context.js';

test('orders profile gives the assistant a specific operational focus', () => {
  const profile = getAdminAiPageProfile('/admin/orders');

  assert.equal(profile.title, 'Orders Vault');
  assert.equal(profile.domain, 'orders');
  assert.match(profile.scope, /paid orders/i);
  assert.ok(profile.prompts.some((prompt) => /recent paid orders/i.test(prompt)));
  assert.ok(profile.quickActions.includes('Summarize Orders'));
});

test('payouts profile targets disbursements and transfers', () => {
  const profile = getAdminAiPageProfile('/admin/payouts');

  assert.equal(profile.title, 'Payout Disbursements');
  assert.equal(profile.domain, 'payouts');
  assert.match(profile.scope, /pending creator transfers/i);
  assert.ok(profile.prompts.some((prompt) => /pending transfer/i.test(prompt)));
});

test('crm profile focuses on leads and outreach scripts', () => {
  const profile = getAdminAiPageProfile('/admin/crm');

  assert.equal(profile.title, 'CRM Lead Pipeline');
  assert.equal(profile.domain, 'crm');
  assert.match(profile.scope, /follow-ups due/i);
  assert.ok(profile.prompts.some((prompt) => /leads need follow-up/i.test(prompt)));
});

test('finance profile targets margins, fees and take-home profit', () => {
  const profile = getAdminAiPageProfile('/admin/finance');

  assert.equal(profile.title, 'Finance & Invoices Hub');
  assert.equal(profile.domain, 'finance');
  assert.match(profile.scope, /Razorpay gateway fees/i);
  assert.ok(profile.prompts.some((prompt) => /net take-home profit/i.test(prompt)));
});

test('creators profile targets partners, applications and tier progression', () => {
  const profile = getAdminAiPageProfile('/admin/creators');

  assert.equal(profile.title, 'Creator Partners');
  assert.equal(profile.domain, 'creators');
  assert.match(profile.scope, /pending applications/i);
  assert.ok(profile.prompts.some((prompt) => /top revenue-generating/i.test(prompt)));
});

test('content routes correctly map to SEO and editorial profile', () => {
  const profile = getAdminAiPageProfile('/admin/blog/new-post');

  assert.equal(profile.title, 'Content & SEO Engine');
  assert.equal(profile.domain, 'blog');
  assert.ok(profile.prompts.some((prompt) => /viral blog post topics/i.test(prompt)));
});

test('default profile provides safe operational triage for unrecognized routes', () => {
  const profile = getAdminAiPageProfile('/admin/unknown-page');

  assert.equal(profile.title, 'Admin Operations');
  assert.equal(profile.domain, 'overview');
  assert.ok(profile.prompts.some((prompt) => /operational attention/i.test(prompt)));
});
