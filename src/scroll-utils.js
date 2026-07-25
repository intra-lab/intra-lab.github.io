export function smoothScrollToTop(duration = 500) {
  let isAnimating = false;
  let userEvents = ['wheel', 'touchmove', 'keydown'];
  
  const startTime = Date.now();

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  function getMaxScrollY() {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    ) - window.innerHeight;
  }

  function abortOnUserScroll(e) {
    // Detect user-initiated scrolling via direct input events
    if (e.type === 'keydown') {
      const keys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Home', 'End'];
      if (!keys.includes(e.key)) return;
    }
    isAnimating = false;
    userEvents.forEach(evt => window.removeEventListener(evt, abortOnUserScroll));
  }

  const start = window.scrollY;
  if (start <= 0) return; // already at top

  function scroll() {
    if (!isAnimating) return;
    
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const targetPosition = start * (1 - easeInOutQuad(progress));
    
    // Clamp target to current max scroll in case page shrank
    const maxScroll = getMaxScrollY();
    const clampedTarget = Math.max(0, Math.min(targetPosition, maxScroll));
    
    window.scrollTo(0, clampedTarget);
    
    if (progress < 1) {
      requestAnimationFrame(scroll);
    } else {
      userEvents.forEach(evt => window.removeEventListener(evt, abortOnUserScroll));
    }
  }
  
  isAnimating = true;
  userEvents.forEach(evt => {
    window.addEventListener(evt, abortOnUserScroll, { passive: true });
  });
  requestAnimationFrame(scroll);
}

export function attachScrollListener(shadowRoot, className = 'scroll-to-top', duration = 1500) {
  shadowRoot.addEventListener('click', (e) => {
    const target = e.target.closest(`.${className}`);
    if (target) {
      smoothScrollToTop(duration);
    }
  }, { passive: true });
}