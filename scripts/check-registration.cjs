const assert = require('node:assert/strict');
const path = require('node:path');
const vm = require('node:vm');
const babel = require('@babel/core');
function load(file, mocks = {}) {
  const { code } = babel.transformFileSync(path.resolve(__dirname, '..', file), {
    babelrc: false, configFile: false,
    plugins: [['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }], '@babel/plugin-transform-modules-commonjs'],
  });
  const module = { exports: {} };
  vm.runInNewContext(code, { module, exports: module.exports, AbortController,
    require: name => Object.hasOwn(mocks, name) ? mocks[name] : require(name) });
  return module.exports;
}
const form = load('app/Auth/registrationForm.js');
const errors = load('services/apiErrors.js');
const draft = { prenom: 'Amina', nom: 'Diop', identifier: 'amina@example.test',
  password: 'ExampleSecret123!', confirmPassword: 'ExampleSecret123!',
  role: 'LOCATAIRE', profession: 'Enseignante', poste: '' };
function harness(api, establish) {
  const states = [], refs = [];
  let cursor = 0, refCursor = 0;
  const react = {
    useState: initial => { const i = cursor++; if (!(i in states)) states[i] = initial;
      return [states[i], value => { states[i] = typeof value === 'function' ? value(states[i]) : value; }]; },
    useRef: initial => refs[refCursor++] ||= { current: initial },
    useCallback: callback => callback, useEffect: () => {},
  };
  const useFlow = load('app/Auth/useRegistrationFlow.js', { react,
    '../../services/authApi': api, '../../services/apiErrors': errors, './registrationForm': form }).default;
  return () => { cursor = 0; refCursor = 0; return useFlow(establish); };
}
async function run() {
  // Inspect the actual navigator: Login entry and one route per registration step.
  const stack = { Navigator: 'Navigator', Screen: 'Screen' };
  const navigator = load('app/navigation/AuthNavigator.jsx', {
    '@react-navigation/native-stack': { createNativeStackNavigator: () => stack },
    '../Auth/ProfileChoiceScreen': 'ProfileChoiceScreen', '../Auth/AccountScreen': 'AccountScreen',
    '../Auth/IdentifierScreen': 'IdentifierScreen', '../Auth/VerificationScreen': 'VerificationScreen',
    '../Auth/CompleteProfileScreen': 'CompleteProfileScreen',
    '../Auth/AuthContext': { useAuth: () => ({ establishSession: () => {} }) },
    '../Auth/useRegistrationFlow': () => ({ registration: { role: null }, reset: () => {}, cancelPending: () => {} }),
  }).default({ route: {} });
  assert.equal(navigator.props.initialRouteName, 'Login');
  const routeNames = Array.from(navigator.props.children, screen => screen.props.name);
  assert.deepEqual(routeNames, ['Login', 'ProfileChoice', 'Identifier', 'Verification', 'CompleteProfile']);
  const { StackRouter, StackActions, CommonActions } = await import('@react-navigation/routers');
  const router = StackRouter({ initialRouteName: 'Login' });
  const options = { routeNames, routeParamList: {}, routeGetIdList: {} };
  let navigationState = router.getInitialState(options);
  for (const name of routeNames.slice(1)) navigationState = router.getStateForAction(navigationState, StackActions.push(name), options);
  for (const name of ['Verification', 'Identifier', 'ProfileChoice', 'Login']) {
    navigationState = router.getStateForAction(navigationState, CommonActions.goBack(), options);
    assert.equal(navigationState.routes[navigationState.index].name, name);
  }
  for (const role of form.registrationRoles) {
    const values = { ...draft, role, poste: 'Gérante' };
    assert.equal(form.validateRegistration(values), null);
    const payload = form.registrationPayload(values, 'test-grant');
    assert.equal(payload.role, role);
    assert.equal(payload.profession, role === 'GERANT_AGENCE' ? null : draft.profession);
    assert.equal(payload.poste, role === 'GERANT_AGENCE' ? 'Gérante' : null);
    assert.equal(payload.email, draft.identifier);
    assert.equal(payload.telephone, null);
  }
  assert(form.validateRegistration({ ...draft, role: 'ADMIN' }));
  assert(form.validateRegistration({ ...draft, role: 'AGENCE' }));
  assert(form.validateRegistration({ ...draft, profession: '' }));
  const phone = form.registrationPayload({ ...draft, identifier: '+221771234567' }, 'test-grant');
  assert.equal(phone.email, null);
  assert.equal(phone.telephone, '+221771234567');
  const unicode = '😀'.repeat(10) + 'a1';
  assert.equal(form.passwordError(unicode, unicode), null);
  assert(form.passwordError('😀'.repeat(9) + 'a1', '😀'.repeat(9) + 'a1'));
  const boundary = 'é'.repeat(35) + 'a1';
  assert.equal(form.passwordError(boundary, boundary), null);
  assert(form.passwordError(boundary + '1', boundary + '1'));
  assert(form.passwordError('abcdefghijklm', 'abcdefghijklm'));
  assert(form.passwordError(draft.password, 'different'));

  const calls = [];
  const api = load('services/authApi.js', { './apiErrors': errors, './httpClient': {
    post: async (url, body, config) => {
      calls.push({ url, body, config });
      return { data: url.endsWith('verify-otp') ? { registrationToken: 'test-grant', verified: true }
        : url.endsWith('registration') || url.endsWith('login') ? { accessToken: 'test-access', user: { role: 'PROPRIETAIRE' } }
        : { expiresIn: 123, resendAfter: 42 } };
    },
  } });
  await api.requestOtp(draft.identifier);
  await api.resendOtp(draft.identifier);
  await api.verifyOtp(draft.identifier, '012345');
  await api.completeRegistration(form.registrationPayload(draft, 'test-grant'));
  await api.login(draft.identifier, draft.password);
  assert(calls.every(call => call.config.requiresAuth === false));
  assert.equal(calls[2].body.otp, '012345');
  assert.equal(calls[3].body.registrationToken, 'test-grant');

  let verifies = 0, completes = 0, sessions = 0, failComplete = false, failStore = false;
  const fakeApi = {
    requestOtp: async () => ({ expiresIn: 123, resendAfter: 42 }),
    resendOtp: async () => ({ expiresIn: 90, resendAfter: 0 }),
    verifyOtp: async (identifier, otp) => { verifies++; assert.equal(otp, '012345'); return 'test-grant'; },
    completeRegistration: async payload => { completes++; assert.equal(payload.registrationToken, 'test-grant');
      if (failComplete) throw new errors.ApiError('network', 'Network');
      return { accessToken: 'test-access', user: { role: 'PROPRIETAIRE' } }; },
  };
  const flow = harness(fakeApi, async session => {
    if (failStore) throw new errors.ApiError('storage', 'Storage');
    assert.equal(session.user.role, 'PROPRIETAIRE'); sessions++;
  });
  const before = Date.now();
  flow().selectRole('LOCATAIRE');
  assert.equal(await flow().finish(draft), false);
  assert.equal(completes, 0);
  assert.equal(await flow().start(draft.identifier), true);
  assert.deepEqual(Object.keys(flow().registration).sort(), ['expiresIn', 'identifier', 'registrationToken', 'resendAfter', 'role']);
  assert.equal(sessions, 0);
  assert(flow().timing.expiresAt >= before + 123000);
  assert(flow().timing.resendAt >= before + 42000);
  assert.equal(await flow().resend(), false);
  await flow().verify('012345');
  assert.equal(completes, 0, 'OTP verification must never create an account');
  assert.equal(sessions, 0);
  assert.equal(flow().registration.registrationToken, 'test-grant');
  flow().cancelPending();
  assert.equal(flow().registration.registrationToken, 'test-grant', 'Back must preserve verification');
  await flow().verify('');
  assert.equal(verifies, 1, 'Continuing after Back must not consume the OTP again');
  failComplete = true;
  await flow().finish(draft);
  assert.equal(flow().registration.registrationToken, 'test-grant');
  assert.equal(sessions, 0);
  failComplete = false; failStore = true;
  await flow().finish(draft);
  assert.equal(verifies, 1);
  assert.equal(flow().accountCreated, true);
  assert.equal(flow().registration.registrationToken, null);
  const count = completes;
  failStore = false;
  await flow().finish({});
  assert.equal(completes, count);
  assert.equal(sessions, 1);
  assert.equal(flow().registration.role, null);
  assert.equal(flow().registration.identifier, '');

  // Cancellation and double submissions must not advance or restore abandoned drafts.
  let resolveRequest, requestCount = 0;
  const slow = harness({ ...fakeApi, requestOtp: () => { requestCount++; return new Promise(resolve => { resolveRequest = resolve; }); } }, async () => {});
  slow().selectRole('LOCATAIRE');
  const pending = slow().start(draft.identifier);
  assert.equal(await slow().start(draft.identifier), false);
  assert.equal(requestCount, 1);
  slow().reset();
  resolveRequest({ expiresIn: 300, resendAfter: 60 });
  assert.equal(await pending, false);
  assert.equal(slow().registration.identifier, '');

  const invalid = harness({ ...fakeApi,
    requestOtp: async () => ({ expiresIn: 300, resendAfter: 0 }),
    verifyOtp: async () => { throw new errors.ApiError('http', 'Expired', { code: 'OTP_EXPIRED', status: 400 }); },
  }, async () => {});
  invalid().selectRole('LOCATAIRE');
  await invalid().start(draft.identifier);
  await invalid().verify('012345');
  assert.equal(invalid().timing.expiresAt, 0);
  await invalid().resend();
  assert(invalid().timing.expiresAt > Date.now());
  assert.equal(invalid().registration.registrationToken, null);
  const oldTiming = invalid().timing;
  await invalid().start(draft.identifier);
  assert.equal(invalid().timing, oldTiming, 'Returning to Identifier must not resend a code');
  invalid().selectRole('GERANT_AGENCE');
  assert.equal(invalid().registration.role, 'GERANT_AGENCE');
  assert.equal(invalid().registration.registrationToken, null);
  assert.equal(invalid().timing, null);
  for (const code of ['INVALID_REQUEST', 'INVALID_IDENTIFIER', 'EMAIL_ALREADY_USED', 'PHONE_ALREADY_USED',
    'OTP_COOLDOWN', 'OTP_RATE_LIMIT', 'AUTH_RATE_LIMIT', 'OTP_DELIVERY_UNAVAILABLE', 'INVALID_OTP',
    'OTP_NOT_FOUND', 'OTP_INVALIDATED', 'OTP_ALREADY_USED', 'OTP_EXPIRED', 'OTP_MAX_ATTEMPTS',
    'REGISTRATION_TOKEN_EXPIRED', 'REGISTRATION_TOKEN_INVALID']) {
    const error = errors.normalizeApiError({ response: { status: 400, data: { code, message: 'Do not expose' } } });
    assert.equal(error.code, code);
    assert.notEqual(error.message, 'Do not expose');
    assert.notEqual(error.message, 'Une erreur est survenue. Veuillez réessayer.');
  }
  console.log('PASS: registration payloads, Unicode/UTF-8 validation, public APIs, OTP string, timers, retries, session timing, storage failure, cancellation and error codes.');
}
run().catch(error => { console.error(error); process.exitCode = 1; });
