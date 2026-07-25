document.addEventListener('DOMContentLoaded', () => {
  const mainPage = document.getElementById('work-cards');
  const globalBackBtn = document.getElementById('global-back-btn');
  const allDetailPages = document.querySelectorAll('.detail-page');
  const contentViewWork = document.getElementById('view-work');
  const spotlightLayer1 = document.getElementById('spotlight-layer-1');
  const spotlightLayer2 = document.getElementById('spotlight-layer-2');
  
  // console.log('[VIEWPROJECT] Elements loaded:', {
  //   mainPage: !!mainPage,
  //   globalBackBtn: !!globalBackBtn,
  //   layer1: !!spotlightLayer1,
  //   layer2: !!spotlightLayer2,
  //   contentViewWork: !!contentViewWork
  // });
  
  // FIX 1: Force transitions on load - everything INSIDE the callback
  [spotlightLayer1, spotlightLayer2].forEach(layer => {
    if (layer) {
      const currentTrans = getComputedStyle(layer).transitionProperty;
      if (currentTrans === 'none' || currentTrans === '') {
        layer.style.transition = 'opacity 0.3s ease-out';
        // console.log(`[VIEWPROJECT] FORCED transition on ${layer.id}`);
      } else {
        // console.log(`[VIEWPROJECT] OK - ${layer.id} has transitions: ${currentTrans}`);
      }
    }
  });
  
  globalBackBtn.classList.add('hidden');
  
  let activeLayer = 1;
  let lastOpenedTarget = null;
  let currentAnimTimeout = null;
  const DEFAULT_GLOW_COLOR = 'hsla(0, 0%, 75%, 0.155)';

  function isOnViewWork() {
    return contentViewWork && contentViewWork.style.display !== 'none' && !contentViewWork.classList.contains('hidden');
  }

  function getGlowColorFromCard(cardElement) {
    const glowValue = cardElement.getAttribute('glow-color');
    if (glowValue && glowValue.startsWith('var(')) {
      const varName = glowValue.match(/var\(([^)]+)\)/)?.[1];
      if (varName) {
        const computed = getComputedStyle(document.documentElement).getPropertyValue(varName.trim()).trim();
        // console.log(`[VIEWPROJECT] Resolved ${varName} → ${computed}`);
        return computed;
      }
    }
    return glowValue || DEFAULT_GLOW_COLOR;
  }

  function clearPendingAnimation() {
    if (currentAnimTimeout) {
      clearTimeout(currentAnimTimeout);
      currentAnimTimeout = null;
    }
  }

  function crossfadeToNewColor(color) {
    if (!spotlightLayer1 || !spotlightLayer2) {
      // console.error('[VIEWPROJECT] MISSING spotlight layers! Cannot crossfade.');
      return;
    }
    
    clearPendingAnimation();
    
    // console.log(`[VIEWPROJECT] Crossfading to color: ${color}, activeLayer: ${activeLayer}`);
    
    const inactiveLayer = activeLayer === 1 ? spotlightLayer2 : spotlightLayer1;
    const activeEl = activeLayer === 1 ? spotlightLayer1 : spotlightLayer2;
    
    inactiveLayer.style.setProperty('--spotlight-color', color);
    inactiveLayer.style.opacity = '1';
    
    currentAnimTimeout = setTimeout(() => {
      activeEl.style.opacity = '0';
      
      currentAnimTimeout = setTimeout(() => {
        activeLayer = activeLayer === 1 ? 2 : 1;
        activeEl.style.setProperty('--spotlight-color', DEFAULT_GLOW_COLOR);
        
        // console.log(`[VIEWPROJECT] Crossfade COMPLETE, now activeLayer=${activeLayer}`);
        currentAnimTimeout = null;
      }, 300);
    }, 10);
  }

  function instantResetSpotlight() {
    if (!spotlightLayer1 || !spotlightLayer2) return;
    
    clearPendingAnimation();
    
    const visibleLayer = activeLayer === 1 ? spotlightLayer1 : spotlightLayer2;
    visibleLayer.style.setProperty('--spotlight-color', DEFAULT_GLOW_COLOR);
    visibleLayer.style.opacity = '1';
    
    const hiddenLayer = activeLayer === 1 ? spotlightLayer2 : spotlightLayer1;
    hiddenLayer.style.opacity = '0';
    
    // console.log('[VIEWPROJECT] INSTANT RESET complete');
  }

  function resetSpotlightColor(force = false) {
    if (!force) {
      const isCardsVisible = mainPage && !mainPage.classList.contains('hidden');
      if (!isCardsVisible) {
        // console.log('[VIEWPROJECT] Not resetting: cards not visible AND force=false');
        return;
      }
    }
    
    // console.log(`[VIEWPROJECT] Resetting spotlight${force ? ' (forced)' : ''}`);
    crossfadeToNewColor(DEFAULT_GLOW_COLOR);
  }

  function handleTabChanged(event) {
    // console.log(`[VIEWPROJECT] Tab changed detected: ${event.detail.fromView} → ${event.detail.toView}`);
    
    if (event.detail.fromView === 'view-work') {
      // console.log('[VIEWPROJECT] Leaving Work tab - instantly resetting spotlight');
      instantResetSpotlight();
    }
    
    if (event.detail.fromView === 'view-info' && event.detail.toView === 'view-work') {
      const shouldHaveDetailOpen = mainPage && mainPage.classList.contains('hidden');
      
      if (shouldHaveDetailOpen && lastOpenedTarget) {
        // console.log(`[VIEWPROJECT] DETECTED: Returning with open detail target=${lastOpenedTarget}`);
        
        const originalCard = document.querySelector(`work-card[data-target="${lastOpenedTarget}"]`);
        
        if (originalCard) {
          const glowColor = getGlowColorFromCard(originalCard);
          // console.log(`[VIEWPROJECT] Restoring glow color: ${glowColor}`);
          crossfadeToNewColor(glowColor);
        } else {
          // console.log('[VIEWPROJECT] Original card not found - instant reset');
          instantResetSpotlight();
        }
      } else {
        // console.log('[VIEWPROJECT] Returning to Work - no detail was open, keeping default');
      }
    }
  }

  window.addEventListener('tab-changed', handleTabChanged);

  document.addEventListener('card-clicked', function(event) {
    // const clickedCard = event.target.closest ? event.target.closest('work-card') : event.target;
    const clickedCard = event.target?.closest('work-card');
if (!clickedCard) return;
    const targetId = clickedCard.getAttribute('data-target');
    const targetPage = document.getElementById(targetId);

    // console.log(`[VIEWPROJECT] Card clicked: ${targetId}`);
    
    lastOpenedTarget = targetId;
    
    const glowColor = getGlowColorFromCard(clickedCard);
    crossfadeToNewColor(glowColor);

    if (targetPage && isOnViewWork()) {
      mainPage.classList.add('hidden');
      targetPage.classList.remove('hidden');
      
      if (typeof window.setDetailPageState === 'function') {
        window.setDetailPageState(true, targetId);
      }
    }
  });

  globalBackBtn.addEventListener('click', function() {
    // console.log('[VIEWPROJECT] Global back button clicked');
    
    instantResetSpotlight();
    
    allDetailPages.forEach(page => {
      page.classList.add('hidden');
    });
    
    mainPage.classList.remove('hidden');
    
    lastOpenedTarget = null;
    
    if (typeof window.setDetailPageState === 'function') {
      window.setDetailPageState(false, null);
    }
  });

  document.querySelectorAll('.detail-page .back-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      // console.log('[VIEWPROJECT] Local back button clicked');
      
      instantResetSpotlight();
      
      allDetailPages.forEach(page => {
        page.classList.add('hidden');
      });
      
      mainPage.classList.remove('hidden');
      
      lastOpenedTarget = null;
      
      if (typeof window.setDetailPageState === 'function') {
        window.setDetailPageState(false, null);
      }
    });
  });
  
  window.addEventListener('beforeunload', clearPendingAnimation);
});