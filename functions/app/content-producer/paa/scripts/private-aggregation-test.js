// siteId 0 = DCC; siteId 1 = WD
const SITE_ID = '%%SITE_ID%%';
const DEBUG_KEY = '%%DEBUG_KEY%%';

function setupIframe() {
  const body = document.querySelector('body');
  const iframe = document.createElement('iframe');
  iframe.style = {
    height: 0,
    width: 0,
    top: 0,
    position: 'absolute'
  }
  iframe.src = `https://localhost:4437/paa/scripts/private-aggregation-test.html?siteId=${SITE_ID}&debugKey=${DEBUG_KEY}`;
  body.appendChild(iframe);
}

setupIframe();
