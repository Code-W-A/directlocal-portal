import test from 'node:test';
import assert from 'node:assert/strict';
import { analyticsParameters, analyticsHostAllowed, safeAnalyticsReferrer, validMeasurementId } from '../src/lib/analytics';
test('analytics only admits public identifiers and aggregate search flags', () => {
  const input = { company_id: 'zoom-cleaning', service_id: 'email@example.org', county_id: 'brasov', city_id: '<script>', has_text_query: true, query_length: 500, email: 'private@example.org', query: 'private search' };
  assert.deepEqual(analyticsParameters(input), {company_id: 'zoom-cleaning', county_id: 'brasov', has_text_query: true, query_length: 100});
  assert.deepEqual(analyticsParameters({query_length: NaN}), {});
});
test('analytics excludes preview hosts and removes referrer paths and query strings', () => {
  assert.equal(analyticsHostAllowed('directlocal.ro'), true);
  for (const host of ['localhost', 'directlocal-portal-six.vercel.app', 'directlocal.ro.evil.org']) assert.equal(analyticsHostAllowed(host), false);
  assert.equal(safeAnalyticsReferrer('https://example.org/private?email=test@example.org#name'), 'https://example.org');
  assert.equal(safeAnalyticsReferrer('javascript:alert(1)'), '');
  assert.equal(validMeasurementId('G-1EK33H5G21'), true);
  assert.equal(validMeasurementId('bad"id'), false);
});
