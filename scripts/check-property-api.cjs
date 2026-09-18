const assert = require('node:assert/strict');
const path = require('node:path');
const vm = require('node:vm');
const babel = require('@babel/core');
const axios = require('axios');
function load(file, mocks = {}) {
  const { code } = babel.transformFileSync(path.resolve(__dirname, '..', file), {
    babelrc: false, configFile: false, plugins: ['@babel/plugin-transform-modules-commonjs'],
  });
  const module = { exports: {} };
  vm.runInNewContext(code, { module, exports: module.exports, FormData,
    process: { env: { EXPO_PUBLIC_API_URL: 'https://api.example.test' } },
    require: name => Object.hasOwn(mocks, name) ? mocks[name] : require(name) });
  return module.exports;
}
async function run() {
  const errors = load('services/apiErrors.js');
  const http = load('services/httpClient.js', { axios, './apiErrors': errors,
    './sessionStorage': { getToken: async () => 'test-token' } });
  const client = http.default;
  client.defaults.headers.common.Authorization = 'Bearer stale';
  const deps = { './httpClient': http, './apiErrors': errors,
    './apiPagination': load('services/apiPagination.js') };
  const p = load('services/propertyApi.js', deps);
  const a = load('services/applicationApi.js', deps);
  let last;
  let status = 200;
  const page = { content: [{ id: 1, status: 'DRAFT' }], number: 0, totalPages: 1, last: true };
  client.defaults.adapter = async config => {
    last = config;
    return { config, status, data: page, headers: {} };
  };
  for (const call of [() => p.getProperties(), () => p.getProperty(7),
    () => p.getPropertyTypes(), () => p.getPropertyType(2)]) {
    await call();
    assert.equal(last.headers.get('Authorization'), undefined);
  }
  assert.equal(await p.getMyProperties({ size: 500, page: -1, search: 'ignored' }), page);
  assert.equal(last.params.size, 100);
  assert.equal(last.params.page, 0);
  assert.equal(last.params.search, undefined);
  await p.getProperties({ furnished: false, minRent: 0, search: 'ignored' });
  assert.equal(last.params.furnished, false);
  assert.equal(last.params.minRent, 0);
  assert.equal(last.params.search, undefined);
  assert.equal(last.params.size, 20);
  const cases = [
    [() => p.getProperty(7, { requiresAuth: true }), 'get', '/properties/7'],
    [() => p.createProperty({ title: 'Test' }), 'post', '/properties'],
    [() => p.updateProperty(7, { rooms: [{ name: 'Salon' }] }), 'put', '/properties/7'],
    [() => p.publishProperty(7), 'post', '/properties/7/publish'],
    [() => p.unpublishProperty(7), 'post', '/properties/7/unpublish'],
    [() => p.deletePropertyPhoto(7, 8), 'delete', '/properties/7/photos/8'],
    [() => a.getMyApplications(), 'get', '/applications/mine'],
    [() => a.getPropertyApplications(7), 'get', '/properties/7/applications'],
    [() => a.getApplication(8), 'get', '/applications/8'],
    ...['review', 'accept', 'reject', 'cancel'].map(action =>
      [() => a[`${action}Application`](8), 'post', `/applications/8/${action}`]),
  ];
  for (const [call, method, endpoint] of cases) {
    await call();
    assert.equal(last.method, method);
    assert.equal(last.url, `/api/v1${endpoint}`);
    assert.equal(last.headers.get('Authorization'), 'Bearer test-token');
    if (method === 'put') assert.equal(JSON.parse(last.data).rooms[0].name, 'Salon');
  }
  await p.uploadPropertyPhoto(7, new Blob(['photo'], { type: 'image/png' }), 'Salon');
  assert.ok(last.data instanceof FormData);
  assert.equal(last.data.get('file').type, 'image/png');
  assert.equal(last.data.get('description'), 'Salon');
  assert.equal(last.headers.get('Authorization'), 'Bearer test-token');
  assert.ok(!String(last.headers.get('Content-Type')).includes('boundary='));
  await assert.rejects(a.createApplication(7), error => error.kind === 'unexpected');
  status = 201;
  assert.equal(await a.createApplication(7), page);
  assert.deepEqual(JSON.parse(last.data), { propertyId: 7 });
  const ui = load('utils/propertyPresentation.js');
  assert.equal(ui.propertyStatusLabel('DRAFT'), 'Brouillon');
  assert.equal(ui.applicationStatusLabel('EN_ETUDE'), "À l'étude");
  assert.equal(ui.getFirstPhoto({ gallery: { photos: [null, { url: '/photo' }] } }).url, '/photo');
  assert.equal(ui.getFirstPhoto(null), null);
  assert.equal(ui.formatLocation({ city: ' Dakar ', country: 'Sénégal' }), 'Dakar, Sénégal');
  assert.match(ui.formatRent(0), /0 FCFA/);
  for (const code of ['PROPERTY_NOT_FOUND', 'PROPERTY_NOT_PUBLISHABLE', 'PROPERTY_ACCESS_DENIED',
    'INVALID_PROPERTY', 'INVALID_SHARED_HOUSING', 'INVALID_PHOTO', 'PHOTO_STORAGE_FAILED',
    'DUPLICATE_APPLICATION', 'INVALID_APPLICATION_STATUS']) {
    const error = errors.normalizeApiError({ response: { status: 400, data: { code } } });
    assert.equal(error.code, code);
    assert.ok(!error.message.startsWith('Une erreur'));
  }
  console.log('Property/application API contract checks passed.');
}
run().catch(error => { console.error(error); process.exitCode = 1; });
