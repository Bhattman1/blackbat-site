/*
 * Where visitors came from, per link: blackbatterminal.com/?ref=ig1
 *
 * Give each Instagram account or creator their own ?ref= value. No code change
 * is needed for a new one. This counts visits and store-button taps per ref in
 * PostHog, and tags the store buttons so downloads show up per ref in App Store
 * Connect (Campaigns) and Google Play Console (Acquisition by UTM). On Android
 * the app also reads it back as its install referrer (lib/analytics.ts).
 *
 * No cookies and no persistent id: the ref and a random visit id last for this
 * browser tab only, and nothing is tied to a person.
 */
(function () {
  var POSTHOG_KEY = 'phc_nYACZGUFwhBAX2gdHWfoWH9rRqXFzX2FoAocJXECb676';
  var POSTHOG_HOST = 'https://us.i.posthog.com';
  /*
   * Apple's provider token, from App Store Connect > App Analytics > Campaigns
   * > Generate Link (the pt= value). Apple ignores the campaign tag without it,
   * so until it's set iPhone downloads aren't split by ref. Taps still are.
   */
  var APP_STORE_PROVIDER_TOKEN = '';

  var REF_PATTERN = /^[a-z0-9_-]{1,40}$/i;

  function read(key) {
    try { return window.sessionStorage.getItem(key); } catch (e) { return null; }
  }
  function write(key, value) {
    try { window.sessionStorage.setItem(key, value); } catch (e) {}
  }

  function currentRef() {
    var fromUrl = new URLSearchParams(window.location.search).get('ref');
    if (fromUrl && REF_PATTERN.test(fromUrl)) {
      write('bb.ref', fromUrl.toLowerCase());
    }
    return read('bb.ref');
  }

  function visitId() {
    var id = read('bb.visit');
    if (!id) {
      id = 'visit_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      write('bb.visit', id);
    }
    return id;
  }

  var ref = currentRef();

  /* Only the live site reports, so local testing never lands in the project. */
  function send(event, properties) {
    if (window.location.hostname !== 'blackbatterminal.com' && !window.BB_ANALYTICS_HOST) return;
    var body = JSON.stringify({
      api_key: POSTHOG_KEY,
      event: event,
      distinct_id: visitId(),
      properties: Object.assign({
        ref: ref || null,
        page: window.location.pathname,
        $lib: 'blackbat-site',
        $process_person_profile: false
      }, properties)
    });
    var url = (window.BB_ANALYTICS_HOST || POSTHOG_HOST) + '/capture/';
    if (!(navigator.sendBeacon && navigator.sendBeacon(url, new Blob([body], { type: 'text/plain' })))) {
      fetch(url, { method: 'POST', body: body, keepalive: true }).catch(function () {});
    }
  }

  function tagAppStore(link) {
    if (!ref || !APP_STORE_PROVIDER_TOKEN) return;
    var url = new URL(link.href);
    url.searchParams.set('pt', APP_STORE_PROVIDER_TOKEN);
    url.searchParams.set('ct', ref);
    url.searchParams.set('mt', '8');
    link.href = url.toString();
  }

  function tagPlay(link) {
    if (!ref) return;
    var url = new URL(link.href);
    url.searchParams.set('referrer', 'utm_source=' + ref + '&utm_medium=social&utm_campaign=site');
    link.href = url.toString();
  }

  function storeOf(link) {
    if (link.href.indexOf('https://apps.apple.com/app/') === 0) return 'app_store';
    if (link.href.indexOf('https://play.google.com/store/apps/details') === 0) return 'google_play';
    return null;
  }

  function start() {
    Array.prototype.forEach.call(document.querySelectorAll('a[href]'), function (link) {
      var store = storeOf(link);
      if (store === 'app_store') tagAppStore(link);
      if (store === 'google_play') tagPlay(link);
    });

    document.addEventListener('click', function (e) {
      var link = e.target.closest && e.target.closest('a[href]');
      var store = link && storeOf(link);
      if (store) send('site_store_tap', { store: store });
    });

    var referrerHost = '';
    try { referrerHost = document.referrer ? new URL(document.referrer).hostname : ''; } catch (e) {}
    send('site_visit', { referrer_host: referrerHost });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
