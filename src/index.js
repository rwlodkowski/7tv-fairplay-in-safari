import { concatInitDataIdAndCertificate, parseContentId } from './fairplay';

const M3U8_URL =
  'https://uspo.manifestservice.v0.maxdome.cloud/mxd-manifest-service/mxd-mediavault/scriptum_test_mercury/scriptum_test_mercury.ism/.m3u8';
const CERT_URL =
  'https://prosieben.live.ott.irdeto.com/streaming/getcertificate?applicationId=prosieben';
const CKC_URL =
  'https://prosieben.live.ott.irdeto.com/streaming/getckc?CrmId=prosieben&AccountId=prosieben&ContentId=scriptum_test_mercury&keyId=';
const KEY_SYSTEM = 'com.apple.fps.1_0';

let certificate;
let player;

function getCert(certUrl) {
  return fetch(certUrl, {
    mode: 'cors',
  }).then((response) => {
    response.arrayBuffer().then((buffer) => {
      certificate = new Uint8Array(buffer);
    });
  });
}

function getLicence(contentId, spc) {
  const ckcForContentUrl = CKC_URL + encodeURIComponent(contentId);

  return fetch(ckcForContentUrl, {
    method: 'POST',
    mode: 'cors',
    body: spc,
  }).then((response) => response.arrayBuffer());
}

function createKeySession(initData) {
  player.webkitSetMediaKeys(new WebKitMediaKeys(KEY_SYSTEM));
  return player.webkitKeys.createSession('video/mp4', initData);
}

function onWebkitKeyMessage(event) {
  const keySession = event.target;
  const spc = event.message;
  const { contentId } = keySession;
  getLicence(contentId, spc).then((ckc) => {
    keySession.update(new Uint8Array(ckc));
  });
}

function onWebkitNeededKey(event) {
  const contentId = parseContentId(event.initData);
  const keySessionInitData = concatInitDataIdAndCertificate(event.initData, contentId, certificate);
  const keySession = createKeySession(keySessionInitData);

  keySession.contentId = contentId;
  keySession.addEventListener('webkitkeymessage', onWebkitKeyMessage, false);
}

function initPlayer(player) {
  player.addEventListener('webkitneedkey', onWebkitNeededKey, false);
  player.src = M3U8_URL;
}

function init() {
  player = document.querySelector('video');

  getCert(CERT_URL).then(() => {
    initPlayer(player);
  });
}

init();
