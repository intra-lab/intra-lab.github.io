(function () {
  // 🔧 Change this to the ID of the element you want to wait for
  var TARGET_ELEMENT_ID = 'pop-up-block-project1-1';

  var overlay = document.getElementById('loading-screen');
  var dismissed = false;

  function dismiss() {
    if (dismissed || !overlay) return;
    dismissed = true;
    overlay.style.opacity = '0';
    setTimeout(function () { overlay.remove(); }, 400);
  }

  // ---- Primary: MutationObserver on the target element ----
  function startObserving(el) {
    var observer = new MutationObserver(function (mutations) {
      // The element received ANY change — dismiss
      requestAnimationFrame(dismiss);
    });
    observer.observe(el, {
      attributes: true,   // catches setAttribute() calls from applyComponent
      childList: true,    // catches innerHTML / appendChild
      subtree: false
    });
  }

  function tryObserve() {
    var el = document.getElementById(TARGET_ELEMENT_ID);
    if (el) {
      startObserving(el);
    } else {
      // Element not yet in DOM — retry shortly
      setTimeout(tryObserve, 50);
    }
  }

  // Start as soon as possible (even before DOMContentLoaded)
  if (document.readyState === 'loading') {
    tryObserve();
  } else {
    tryObserve();
  }

  // ---- Backup: pipeline events ----
  // Your pipeline dispatches "<stage-name>-loaded" and "pipeline-complete"
  // We'll just listen for pipeline-complete as ultimate backup
  window.addEventListener('pipeline-complete', dismiss);

  // ---- Safety net: 15s timeout ----
  setTimeout(dismiss, 15000);
})();