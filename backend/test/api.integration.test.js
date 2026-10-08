import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { after, before, test } from 'node:test';
import app from '../src/app.js';
import User from '../src/models/User.js';

let server;
let baseUrl;

before(async () => {
  const uri = process.env.MONGODB_TEST_URI;
  if (!uri) throw new Error('Set MONGODB_TEST_URI to a dedicated MongoDB database ending in _test.');
  const dbName = new URL(uri).pathname.replace(/^\//, '').split('?')[0];
  if (!dbName.toLowerCase().endsWith('_test')) throw new Error('Refusing to run integration tests: MONGODB_TEST_URI database name must end in _test.');
  await mongoose.connect(uri);
  await mongoose.connection.dropDatabase();
  server = app.listen(0, '127.0.0.1');
  await new Promise((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}/api/v1`;
});

after(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  }
  if (server?.listening) await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

async function call(path, { method = 'GET', token, body } = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      ...(body === undefined ? {} : { 'content-type': 'application/json' }),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  return { status: response.status, payload: await response.json() };
}

async function register(role, email, extra = {}) {
  const result = await call('/auth/register', { method: 'POST', body: { fullName: `${role} test`, email, password: 'StrongTestPass123!', role, ...extra } });
  assert.equal(result.status, 201, JSON.stringify(result.payload));
  return result.payload.data;
}

test('auth, profiles, password reset, NGO review, donations, notifications, and metrics work together', async () => {
  const suffix = `${Date.now()}@example.test`;
  const donor = await register('donor', `donor-${suffix}`);
  const ngo = await register('ngo', `ngo-${suffix}`, { organization: 'Test Community Kitchen', registrationNumber: 'REG-TEST-001', verificationEvidenceUrl: 'https://documents.example.test/registration.pdf' });
  const volunteer = await register('volunteer', `volunteer-${suffix}`);
  assert.equal(ngo.user.verificationStatus, 'PENDING');

  const incompleteNgo = await call('/auth/register', { method: 'POST', body: { fullName: 'Incomplete NGO', email: `incomplete-${suffix}`, password: 'StrongTestPass123!', role: 'ngo', organization: 'No proof number' } });
  assert.equal(incompleteNgo.status, 400);

  await User.create({ name: 'Test Admin', email: `admin-${suffix}`, passwordHash: await bcrypt.hash('StrongAdminPass123!', 12), role: 'admin' });
  const adminLogin = await call('/auth/login', { method: 'POST', body: { email: `admin-${suffix}`, password: 'StrongAdminPass123!' } });
  assert.equal(adminLogin.status, 200);
  const adminToken = adminLogin.payload.data.token;

  const forbiddenAdminList = await call('/admin/ngos', { token: ngo.token });
  assert.equal(forbiddenAdminList.status, 403);
  const pendingApplications = await call('/admin/ngos?status=PENDING', { token: adminToken });
  assert.equal(pendingApplications.status, 200);
  assert.ok(pendingApplications.payload.data.items.some((item) => item.id === ngo.user.id));

  const donationCreate = await call('/donations', {
    method: 'POST', token: donor.token,
    body: { eventName: 'Test Event', eventType: 'Community', foodType: 'Meals', quantity: '10 meals', estimatedMeals: 10, address: '10 Test Street', city: 'Test City' },
  });
  assert.equal(donationCreate.status, 201, JSON.stringify(donationCreate.payload));
  const donationId = donationCreate.payload.data.donation._id;
  const hiddenDonations = await call('/donations', { token: ngo.token });
  assert.equal(hiddenDonations.payload.data.items.length, 0);
  const blockedAccept = await call(`/donations/${donationId}/accept`, { method: 'POST', token: ngo.token });
  assert.equal(blockedAccept.status, 403);
  assert.equal(blockedAccept.payload.error.code, 'NGO_NOT_VERIFIED');

  const rejectWithoutNote = await call(`/admin/ngos/${ngo.user.id}/verification`, { method: 'PATCH', token: adminToken, body: { status: 'REJECTED' } });
  assert.equal(rejectWithoutNote.status, 400);
  const rejectedNgo = await call(`/admin/ngos/${ngo.user.id}/verification`, { method: 'PATCH', token: adminToken, body: { status: 'REJECTED', note: 'Check the submitted registration.' } });
  assert.equal(rejectedNgo.payload.data.ngo.verificationStatus, 'REJECTED');
  const approvedNgo = await call(`/admin/ngos/${ngo.user.id}/verification`, { method: 'PATCH', token: adminToken, body: { status: 'VERIFIED', note: 'Registration checked.' } });
  assert.equal(approvedNgo.payload.data.ngo.verificationStatus, 'VERIFIED');

  const visibleDonations = await call('/donations', { token: ngo.token });
  assert.ok(visibleDonations.payload.data.items.some((item) => item._id === donationId));
  const accepted = await call(`/donations/${donationId}/accept`, { method: 'POST', token: ngo.token });
  assert.equal(accepted.payload.data.donation.status, 'ACCEPTED');
  const assignment = await call(`/donations/${donationId}/assign-volunteer`, { method: 'POST', token: volunteer.token });
  assert.equal(assignment.payload.data.donation.status, 'PICKUP_ASSIGNED');
  for (const status of ['PICKUP_IN_PROGRESS', 'PICKED_UP', 'DELIVERY_IN_PROGRESS', 'DELIVERED', 'COMPLETED']) {
    const update = await call(`/donations/${donationId}/status`, { method: 'PATCH', token: volunteer.token, body: { status } });
    assert.equal(update.payload.data.donation.status, status);
  }

  const profileUpdate = await call('/auth/me', { method: 'PATCH', token: donor.token, body: { name: 'Updated Donor', phone: '5550100' } });
  assert.equal(profileUpdate.payload.data.user.name, 'Updated Donor');
  const preferences = await call('/auth/me/preferences', { method: 'PATCH', token: donor.token, body: { email: false } });
  assert.equal(preferences.payload.data.user.notificationPreferences.email, false);
  const donorNotifications = await call('/notifications', { token: donor.token });
  const donationNotice = donorNotifications.payload.data.items.find((item) => item.donationId === donationId);
  assert.ok(donationNotice);
  const markedRead = await call(`/notifications/${donationNotice.id}/read`, { method: 'PATCH', token: donor.token });
  assert.equal(markedRead.payload.data.notification.read, true);
  assert.equal((await call('/notifications/read-all', { method: 'PATCH', token: donor.token })).status, 200);
  const impact = await call('/impact');
  assert.equal(impact.payload.data.mealsServed, 10);
  assert.equal(impact.payload.data.completedDeliveries, 1);
  const adminMetrics = await call('/admin/metrics', { token: adminToken });
  assert.ok(adminMetrics.payload.data.verifiedNgos >= 1);
  assert.ok(adminMetrics.payload.data.completionRate > 0);

  const changedNgo = await call('/auth/me', { method: 'PATCH', token: ngo.token, body: { verificationEvidenceUrl: 'https://documents.example.test/updated-registration.pdf' } });
  assert.equal(changedNgo.payload.data.user.verificationStatus, 'PENDING');
  const updatedQueue = await call('/admin/ngos?status=PENDING', { token: adminToken });
  assert.ok(updatedQueue.payload.data.items.some((item) => item.id === ngo.user.id));

  const passwordChange = await call('/auth/me/password', { method: 'PATCH', token: donor.token, body: { currentPassword: 'StrongTestPass123!', newPassword: 'ChangedTestPass123!' } });
  assert.equal(passwordChange.status, 200);
  assert.equal((await call('/auth/me', { token: donor.token })).status, 401);
  assert.equal((await call('/auth/login', { method: 'POST', body: { email: `donor-${suffix}`, password: 'ChangedTestPass123!' } })).status, 200);

  const resetRequest = await call('/auth/forgot-password', { method: 'POST', body: { email: `donor-${suffix}` } });
  assert.equal(resetRequest.status, 200);
  assert.match(resetRequest.payload.data.devResetUrl, /reset-password\?token=/);
  const resetToken = new URL(resetRequest.payload.data.devResetUrl).searchParams.get('token');
  const reset = await call('/auth/reset-password', { method: 'POST', body: { token: resetToken, password: 'ResetTestPass123!' } });
  assert.equal(reset.status, 200);
  assert.equal((await call('/auth/reset-password', { method: 'POST', body: { token: resetToken, password: 'SecondResetPass123!' } })).status, 400);
  assert.equal((await call('/auth/login', { method: 'POST', body: { email: `donor-${suffix}`, password: 'ResetTestPass123!' } })).status, 200);

  const health = await call('/health');
  assert.equal(health.status, 200);
  assert.equal(health.payload.data.database, 'connected');
});
